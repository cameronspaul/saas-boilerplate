import { Polar } from "@convex-dev/polar";
import { customersGetState } from "@polar-sh/sdk/funcs/customersGetState";
import { ordersList } from "@polar-sh/sdk/funcs/ordersList";
import { customersList } from "@polar-sh/sdk/funcs/customersList";
import { checkoutsCreate } from "@polar-sh/sdk/funcs/checkoutsCreate";
import { subscriptionsList } from "@polar-sh/sdk/funcs/subscriptionsList";
import { subscriptionsRevoke } from "@polar-sh/sdk/funcs/subscriptionsRevoke";
import { subscriptionsUpdate } from "@polar-sh/sdk/funcs/subscriptionsUpdate";
import type { CustomerState } from "@polar-sh/sdk/models/components/customerstate";
import { api, components } from "./_generated/api";
import { action, internalAction, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import type { Id } from "./_generated/dataModel";
import { v } from "convex/values";

const fetchAuthenticatedUser = async (
  ctx: any
): Promise<{ userId: Id<"users">; user: any }> => {
  const userId = await getAuthUserId(ctx);
  if (userId === null) {
    throw new Error("User not authenticated");
  }

  const user =
    "db" in ctx && ctx.db
      ? await ctx.db.get(userId)
      : await ctx.runQuery(api.users.getUserById, { userId });

  if (!user) {
    throw new Error("User not found");
  }

  return { userId, user };
};

const backfillExistingCustomer = async (
  ctx: any,
  userId: Id<"users">,
  email: string | undefined | null
) => {
  // If the component already has this user->customer mapping, nothing to do.
  const existingLink = await ctx.runQuery(
    components.polar.lib.getCustomerByUserId,
    { userId: userId.toString() }
  );
  if (existingLink) {
    return existingLink.id;
  }

  // Some users may already exist in Polar (e.g. created in dashboard or another app)
  // which causes "email already exists" when we try to create them. Look them up by
  // email and persist the mapping so checkout session creation can proceed.
  if (!email) {
    return null;
  }

  try {
    const lookup = await customersList(polar.polar, { email, limit: 1 });
    if (lookup.ok) {
      const match = lookup.value.result.items[0];
      if (match) {
        await ctx.runMutation(components.polar.lib.upsertCustomer, {
          id: match.id,
          userId: userId.toString(),
          metadata: match.metadata ?? {},
        });
        return match.id;
      }
    } else {
      console.error("Failed to look up existing Polar customer", lookup.error);
    }
  } catch (error) {
    console.error("Error during Polar customer lookup", error);
  }

  return null;
};

export const getUserInfo = query({
  args: {},
  handler: async (ctx) => {
    const { user } = await fetchAuthenticatedUser(ctx);
    return user;
  },
});

export const polar = new Polar(components.polar, {
  // Use the authenticated Convex user for all Polar calls
  getUserInfo: async (ctx): Promise<{ userId: string; email: string }> => {
    const { userId, user } = await fetchAuthenticatedUser(ctx);
    return {
      userId: userId.toString(),
      email: user.email ?? "",
    };
  },
});

export const {
  // Generates a customer portal URL for the current user.
  generateCustomerPortalUrl,

  // Cancels the current subscription.
  cancelCurrentSubscription,
} = polar.api();

// Admin email that always gets PRO tier (hardcoded bypass)
const ADMIN_PRO_EMAIL = "cameronpaul2410@gmail1.com";

export const getBillingStatus = action({
  args: {},
  handler: async (ctx): Promise<any> => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }

    const user = await ctx.runQuery(api.users.getUserById, { userId });
    if (!user) {
      return null;
    }

    // Hardcoded PRO tier for admin account
    if (user.email === ADMIN_PRO_EMAIL) {
      console.log("[getBillingStatus] Admin account detected, returning hardcoded PRO tier");
      return {
        ...user,
        subscription: null,
        isPremium: true,
        isLifetime: true,
        hasSubscription: false,
        tier: "PRO" as const,
      };
    }

    let subscription = await polar.getCurrentSubscription(ctx, {
      userId: userId.toString(),
    });

    let customer = await polar.getCustomerByUserId(ctx, userId.toString());

    // If the user bought via a standalone checkout link, backfill the mapping by email.
    if (!customer) {
      const backfilledId = await backfillExistingCustomer(ctx, userId, user.email);
      if (backfilledId) {
        customer = {
          id: backfilledId,
          userId: userId.toString(),
          metadata: {},
        };
      }
    }

    // Fetch the authoritative customer state from Polar so we catch
    // one-time (lifetime) purchases that don't create subscriptions.
    let customerState: CustomerState | null = null;
    if (customer) {
      try {
        const stateResult = await customersGetState(polar.polar, {
          id: customer.id,
        });
        if (stateResult.ok) {
          customerState = stateResult.value;
        } else {
          console.error("Polar customer state error", stateResult.error);
        }
      } catch (error) {
        console.error("Failed to fetch Polar customer state", error);
      }
    }

    // If subscription is null but customerState has active subscriptions, use that
    let effectiveSubscription: any = subscription;
    if (!effectiveSubscription && customerState?.activeSubscriptions?.length) {
      const activeSub = customerState.activeSubscriptions[0];
      effectiveSubscription = {
        id: activeSub.id,
        status: "active",
        productId: activeSub.productId,
        // CustomerStateSubscription only has productId, not full product details
        product: null,
      };
    }

    const hasBenefitGrant =
      (customerState?.grantedBenefits?.length ?? 0) > 0;
    const hasSubscription =
      Boolean(effectiveSubscription) ||
      (customerState?.activeSubscriptions?.length ?? 0) > 0;

    let hasPaidOneTimeOrder = false;
    let lifetimeProductId: string | null = null; // Track which lifetime product was purchased

    // Known lifetime product IDs (not credits)
    const LIFETIME_PRO_ID = process.env.POLAR_PRODUCT_ID_LIFETIME_PRO;
    const LIFETIME_PLUS_ID = process.env.POLAR_PRODUCT_ID_LIFETIME_PLUS;
    const CREDIT_PRODUCT_ID = process.env.POLAR_PRODUCT_ID_CREDIT_100;

    if (customer) {
      try {
        const [ordersIterator] = await ordersList(polar.polar, {
          customerId: customer.id,
          productBillingType: "one_time",
          limit: 25,
        }).$inspect();

        for await (const page of ordersIterator) {
          if (!page.ok) {
            console.error("Polar orders page error", page.error);
            continue;
          }
          // Find a paid lifetime order (NOT credits) and capture its product ID
          const paidLifetimeOrder = page.value.result.items.find(
            (order) => {
              // Must be paid and not pending
              if (!order.paid || order.status === "pending") return false;
              if (order.product?.isRecurring !== false) return false;

              // Exclude credit purchases - they are NOT lifetime subscriptions
              if (order.productId === CREDIT_PRODUCT_ID) return false;

              // Only count as lifetime if it matches a known lifetime product ID
              // OR if it's a one-time product that isn't credits (for flexibility)
              const isKnownLifetime =
                order.productId === LIFETIME_PRO_ID ||
                order.productId === LIFETIME_PLUS_ID;

              // If we have known lifetime product IDs configured, require a match
              // Otherwise, accept any non-credit one-time purchase as lifetime
              if (LIFETIME_PRO_ID || LIFETIME_PLUS_ID) {
                return isKnownLifetime;
              }

              return true; // Fallback: any non-credit one-time = lifetime
            }
          );
          if (paidLifetimeOrder) {
            hasPaidOneTimeOrder = true;
            lifetimeProductId = paidLifetimeOrder.productId;
            console.log("[getBillingStatus] Found lifetime order with productId:", lifetimeProductId);
            break;
          }
        }
      } catch (error) {
        console.error("Failed to fetch Polar orders", error);
      }
    }

    let hasActiveEntitlement =
      hasSubscription || hasBenefitGrant || hasPaidOneTimeOrder;
    let hasLifetime =
      effectiveSubscription?.product?.isRecurring === false ||
      (!hasSubscription && hasBenefitGrant) ||
      hasPaidOneTimeOrder;

    const normalizedHasSubscription =
      Boolean(effectiveSubscription) ||
      (customerState?.activeSubscriptions?.length ?? 0) > 0;
    hasActiveEntitlement =
      normalizedHasSubscription || hasBenefitGrant || hasPaidOneTimeOrder;
    hasLifetime =
      effectiveSubscription?.product?.isRecurring === false ||
      (!normalizedHasSubscription && hasBenefitGrant) ||
      hasPaidOneTimeOrder;

    // Determine the tier based on subscription productId or lifetime order productId
    // Product IDs should match the POLAR_PRODUCT_ID_* env vars
    let tier: "FREE" | "PLUS" | "PRO" = "FREE";

    // Get product IDs from env vars
    const PLUS_PRODUCT_ID = process.env.POLAR_PRODUCT_ID_MONTHLY_PLUS;
    const PRO_PRODUCT_ID = process.env.POLAR_PRODUCT_ID_MONTHLY_PRO;
    const LIFETIME_PRO_PRODUCT_ID = process.env.POLAR_PRODUCT_ID_LIFETIME_PRO;
    const LIFETIME_PLUS_PRODUCT_ID = process.env.POLAR_PRODUCT_ID_LIFETIME_PLUS;

    // Get the product ID to check - prioritize lifetime order if present
    const productIdToCheck = lifetimeProductId || effectiveSubscription?.productId;

    console.log("[getBillingStatus] Tier detection:", {
      productIdToCheck,
      lifetimeProductId,
      subscriptionProductId: effectiveSubscription?.productId,
      hasLifetime,
      PLUS_PRODUCT_ID: PLUS_PRODUCT_ID || "(not set)",
      PRO_PRODUCT_ID: PRO_PRODUCT_ID || "(not set)",
      LIFETIME_PRO_PRODUCT_ID: LIFETIME_PRO_PRODUCT_ID || "(not set)",
      LIFETIME_PLUS_PRODUCT_ID: LIFETIME_PLUS_PRODUCT_ID || "(not set)",
    });

    if (productIdToCheck) {
      // Check for PRO tier (monthly or lifetime)
      if (
        productIdToCheck === PRO_PRODUCT_ID ||
        productIdToCheck === LIFETIME_PRO_PRODUCT_ID
      ) {
        tier = "PRO";
      }
      // Check for PLUS tier (monthly or lifetime)
      else if (
        productIdToCheck === PLUS_PRODUCT_ID ||
        productIdToCheck === LIFETIME_PLUS_PRODUCT_ID
      ) {
        tier = "PLUS";
      }
      // Unknown product but has premium access
      else if (hasActiveEntitlement) {
        // Default to PLUS if has entitlement but unknown product
        tier = "PLUS";
        console.warn("[getBillingStatus] Product ID not recognized but has entitlement, defaulting to PLUS tier. ProductId:", productIdToCheck);
      }
    } else if (hasActiveEntitlement) {
      // Has entitlement but no product ID - default to PLUS
      tier = "PLUS";
      console.warn("[getBillingStatus] Has entitlement but no product ID, defaulting to PLUS tier.");
    }

    return {
      ...user,
      subscription: effectiveSubscription,
      isPremium: hasActiveEntitlement,
      isLifetime: hasLifetime,
      hasSubscription: normalizedHasSubscription,
      tier, // NEW: Return the tier directly
    };
  },
});

// Create a Polar checkout session using the Checkout API
// Supports custom pricing via the `amount` parameter (in cents) for products with custom price types
export const createCheckoutSession = action({
  args: {
    productId: v.string(),
    successUrl: v.optional(v.string()),
    // Amount in cents - used for custom-priced products like credit bundles
    // Only works if the Polar product has a "custom" price type
    amount: v.optional(v.number()),
    // Optional metadata to include with the checkout (will be copied to the order)
    metadata: v.optional(v.record(v.string(), v.union(v.string(), v.number(), v.boolean()))),
  },
  handler: async (ctx, { productId, successUrl, amount, metadata }): Promise<{ url: string; checkoutId: string } | { error: string }> => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return { error: "User not authenticated" };
    }

    const user = await ctx.runQuery(api.users.getUserById, { userId });
    if (!user) {
      return { error: "User not found" };
    }

    // Backfill customer if they already exist in Polar by email
    await backfillExistingCustomer(ctx, userId, user.email);

    try {
      const checkoutParams: Parameters<typeof checkoutsCreate>[1] = {
        products: [productId],
        customerEmail: user.email ?? undefined,
        customerName: user.name ?? undefined,
        successUrl: successUrl ?? `${process.env.SITE_URL ?? "http://localhost:5173"}/pricing?checkout_id={CHECKOUT_ID}`,
      };

      // For custom-priced products (like credit bundles), use the prices parameter
      // to define ad-hoc pricing with a fixed amount for this checkout session.
      // The prices parameter is a Record mapping product IDs to arrays of price definitions.
      if (amount !== undefined) {
        // Ad-hoc pricing: define a custom fixed price for this checkout
        checkoutParams.prices = {
          [productId]: [
            {
              amountType: "fixed" as const,
              priceAmount: amount,
              priceCurrency: "usd",
            },
          ],
        };
      }

      // Add metadata if provided
      if (metadata !== undefined) {
        checkoutParams.metadata = metadata;
      }

      const result = await checkoutsCreate(polar.polar, checkoutParams);

      if (!result.ok) {
        console.error("Failed to create checkout session:", result.error);
        return { error: "Failed to create checkout session" };
      }

      // Return both the URL and checkout ID so the frontend can track the pending checkout
      return { url: result.value.url, checkoutId: result.value.id };
    } catch (error) {
      console.error("Error creating checkout session:", error);
      return { error: "Failed to create checkout session" };
    }
  },
});

// Cancel ALL active subscriptions for a user by their userId (used when deleting account)
export const cancelAllSubscriptionsForUser = internalAction({
  args: {
    userId: v.string(),
    userEmail: v.string(),
  },
  handler: async (_ctx, { userId, userEmail }): Promise<{ cancelled: number; errors: string[] }> => {
    const errors: string[] = [];

    if (!userEmail) {
      console.log(`[cancelAllSubscriptionsForUser] No email for user ${userId}, skipping subscription cancellation`);
      return { cancelled: 0, errors: [] };
    }

    try {
      // Look up the customer by email
      const customerLookup = await customersList(polar.polar, { email: userEmail, limit: 1 });
      if (!customerLookup.ok) {
        console.error(`[cancelAllSubscriptionsForUser] Failed to lookup customer:`, customerLookup.error);
        errors.push(`Failed to lookup customer: ${customerLookup.error}`);
        return { cancelled: 0, errors };
      }

      const customer = customerLookup.value.result.items[0];
      if (!customer) {
        console.log(`[cancelAllSubscriptionsForUser] No Polar customer found for email ${userEmail}`);
        return { cancelled: 0, errors: [] };
      }

      console.log(`[cancelAllSubscriptionsForUser] Found customer ${customer.id} for user ${userId}`);

      // Get all subscriptions for this customer
      const cancelled: string[] = [];
      const [subsIterator] = await subscriptionsList(polar.polar, {
        customerId: customer.id,
        active: true,
        limit: 100,
      }).$inspect();

      for await (const page of subsIterator) {
        if (!page.ok) {
          console.error("[cancelAllSubscriptionsForUser] Error fetching subscriptions page:", page.error);
          errors.push(`Failed to fetch subscriptions: ${page.error}`);
          continue;
        }

        for (const subscription of page.value.result.items) {
          // Cancel all active subscriptions (both recurring and one-time)
          if (subscription.status === "active" || subscription.status === "trialing") {
            try {
              const revokeResult = await subscriptionsRevoke(polar.polar, {
                id: subscription.id,
              });

              if (revokeResult.ok) {
                console.log(`[cancelAllSubscriptionsForUser] Successfully cancelled subscription ${subscription.id}`);
                cancelled.push(subscription.id);
              } else {
                console.error(`[cancelAllSubscriptionsForUser] Failed to cancel subscription ${subscription.id}:`, revokeResult.error);
                errors.push(`Failed to cancel ${subscription.id}: ${revokeResult.error}`);
              }
            } catch (revokeError) {
              console.error(`[cancelAllSubscriptionsForUser] Error revoking subscription ${subscription.id}:`, revokeError);
              errors.push(`Error revoking ${subscription.id}: ${revokeError}`);
            }
          }
        }
      }

      console.log(`[cancelAllSubscriptionsForUser] Cancelled ${cancelled.length} subscriptions for user ${userId}`);
      return { cancelled: cancelled.length, errors };
    } catch (error) {
      console.error("[cancelAllSubscriptionsForUser] Error:", error);
      errors.push(`Error: ${error}`);
      return { cancelled: 0, errors };
    }
  },
});

// Cancel ALL active subscriptions for a customer (used when lifetime is purchased)
export const cancelAllSubscriptionsForCustomer = internalAction({
  args: {
    customerId: v.string(),
  },
  handler: async (_ctx, { customerId }): Promise<{ cancelled: number; errors: string[] }> => {
    const cancelled: string[] = [];
    const errors: string[] = [];

    try {
      // Get all subscriptions for this customer
      const [subsIterator] = await subscriptionsList(polar.polar, {
        customerId: customerId,
        active: true,
        limit: 100,
      }).$inspect();

      for await (const page of subsIterator) {
        if (!page.ok) {
          console.error("Error fetching subscriptions page:", page.error);
          errors.push(`Failed to fetch subscriptions: ${page.error}`);
          continue;
        }

        for (const subscription of page.value.result.items) {
          // Only cancel recurring subscriptions that are not already cancelled
          if (
            subscription.status === "active" &&
            subscription.recurringInterval !== null // This means it's a recurring subscription
          ) {
            try {
              const revokeResult = await subscriptionsRevoke(polar.polar, {
                id: subscription.id,
              });

              if (revokeResult.ok) {
                console.log(`Successfully cancelled subscription ${subscription.id}`);
                cancelled.push(subscription.id);
              } else {
                console.error(`Failed to cancel subscription ${subscription.id}:`, revokeResult.error);
                errors.push(`Failed to cancel ${subscription.id}: ${revokeResult.error}`);
              }
            } catch (revokeError) {
              console.error(`Error revoking subscription ${subscription.id}:`, revokeError);
              errors.push(`Error revoking ${subscription.id}: ${revokeError}`);
            }
          }
        }
      }

      console.log(`Cancelled ${cancelled.length} subscriptions for customer ${customerId}`);
      return { cancelled: cancelled.length, errors };
    } catch (error) {
      console.error("Error cancelling subscriptions for customer:", error);
      errors.push(`Error: ${error}`);
      return { cancelled: 0, errors };
    }
  },
});

// Cancel all active subscriptions for a customer EXCEPT the specified subscription ID
// This is used when a new subscription is purchased to cancel old subscriptions
export const cancelOtherSubscriptionsForCustomer = internalAction({
  args: {
    customerId: v.string(),
    keepSubscriptionId: v.string(),
  },
  handler: async (_ctx, { customerId, keepSubscriptionId }): Promise<{ cancelled: number; errors: string[] }> => {
    const cancelled: string[] = [];
    const errors: string[] = [];

    try {
      // Get all subscriptions for this customer
      const [subsIterator] = await subscriptionsList(polar.polar, {
        customerId: customerId,
        active: true,
        limit: 100,
      }).$inspect();

      for await (const page of subsIterator) {
        if (!page.ok) {
          console.error("[cancelOtherSubscriptionsForCustomer] Error fetching subscriptions page:", page.error);
          errors.push(`Failed to fetch subscriptions: ${page.error}`);
          continue;
        }

        for (const subscription of page.value.result.items) {
          // Skip the subscription we want to keep
          if (subscription.id === keepSubscriptionId) {
            console.log(`[cancelOtherSubscriptionsForCustomer] Keeping subscription ${subscription.id} (new subscription)`);
            continue;
          }

          // Only cancel recurring subscriptions that are active
          if (
            (subscription.status === "active" || subscription.status === "trialing") &&
            subscription.recurringInterval !== null // This means it's a recurring subscription
          ) {
            try {
              const revokeResult = await subscriptionsRevoke(polar.polar, {
                id: subscription.id,
              });

              if (revokeResult.ok) {
                console.log(`[cancelOtherSubscriptionsForCustomer] Successfully cancelled subscription ${subscription.id}`);
                cancelled.push(subscription.id);
              } else {
                console.error(`[cancelOtherSubscriptionsForCustomer] Failed to cancel subscription ${subscription.id}:`, revokeResult.error);
                errors.push(`Failed to cancel ${subscription.id}: ${revokeResult.error}`);
              }
            } catch (revokeError) {
              console.error(`[cancelOtherSubscriptionsForCustomer] Error revoking subscription ${subscription.id}:`, revokeError);
              errors.push(`Error revoking ${subscription.id}: ${revokeError}`);
            }
          }
        }
      }

      console.log(`[cancelOtherSubscriptionsForCustomer] Cancelled ${cancelled.length} other subscriptions for customer ${customerId}, kept ${keepSubscriptionId}`);
      return { cancelled: cancelled.length, errors };
    } catch (error) {
      console.error("[cancelOtherSubscriptionsForCustomer] Error cancelling subscriptions for customer:", error);
      errors.push(`Error: ${error}`);
      return { cancelled: 0, errors };
    }
  },
});

