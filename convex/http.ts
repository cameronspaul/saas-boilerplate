import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { auth } from "./auth";
import type { EmailType } from "./emailTemplates";

const http = httpRouter();

auth.addHttpRoutes(http);

// Verify Polar webhook signature (Standard Webhooks / Svix format)
async function verify(body: string, req: Request, secret: string): Promise<boolean> {
  const id = req.headers.get("webhook-id") || req.headers.get("svix-id");
  const ts = req.headers.get("webhook-timestamp") || req.headers.get("svix-timestamp");
  const sigs = req.headers.get("webhook-signature") || req.headers.get("svix-signature");
  if (!id || !ts || !sigs) return false;

  const sec = secret.startsWith("whsec_") ? secret.slice(6) : secret;
  let b64 = sec.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  let keyBytes: Uint8Array;
  try { const bin = atob(b64); keyBytes = new Uint8Array([...bin].map(c => c.charCodeAt(0))); }
  catch { keyBytes = new TextEncoder().encode(sec); }

  const key = await crypto.subtle.importKey("raw", keyBytes.buffer as ArrayBuffer, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signed = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${id}.${ts}.${body}`));
  const expected = btoa(String.fromCharCode(...new Uint8Array(signed)));
  return sigs.split(" ").map(s => s.split(",")[1]).filter(Boolean).includes(expected);
}

// Polar webhook handler
http.route({
  path: "/polar/events",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.text();
      if (!await verify(body, request, process.env.POLAR_WEBHOOK_SECRET ?? "")) {
        console.error("Webhook verification failed");
        return new Response("", { status: 403 });
      }

      // Parse the event
      const event = JSON.parse(body);

      // Handle all event types
      switch (event.type) {
        // Order events
        case "order.paid":
          console.log("Order paid:", event.data);
          const productId = event.data.product_id;

          // Extract customer info from event data
          const customerEmail = event.data.customer?.email || event.data.user?.email;
          const customerName = event.data.customer?.name || event.data.user?.name || "Valued Customer";
          const productName = event.data.product?.name || "Product";
          const amount = event.data.amount ? (event.data.amount / 100).toFixed(2) : "0.00";
          const currency = event.data.currency?.toUpperCase() || "USD";
          const orderId = event.data.id;
          const checkoutId = event.data.checkout_id || event.data.checkout?.id;

          // Mark the pending checkout as paid if we have a checkoutId
          if (checkoutId && orderId) {
            try {
              await ctx.runMutation(internal.checkouts.markCheckoutPaid, {
                checkoutId,
                orderId,
              });
              console.log(`[Webhook] Marked checkout ${checkoutId} as paid`);
            } catch (checkoutError) {
              console.error("[Webhook] Failed to mark checkout as paid:", checkoutError);
              // Don't fail the webhook if this fails
            }
          }

          // Extract credit bundle metadata if available (passed during checkout)
          const orderMetadata = event.data.metadata || {};
          const creditsCount = orderMetadata.credits ? Number(orderMetadata.credits) : undefined;
          const bundleName = orderMetadata.bundle_name || undefined;

          // Determine email type based on product
          let emailType: EmailType = "generic_purchase";
          let isCreditsBundle = false;
          let isPremiumPurchase = false;

          switch (productId) {
            // Plus & Pro monthly tiers are ignored here as they are handled in 'subscription.created'
            case process.env.POLAR_PRODUCT_ID_MONTHLY_PLUS:
            case process.env.POLAR_PRODUCT_ID_MONTHLY_PRO:
              break;

            // Lifetime Pro & Plus
            case process.env.POLAR_PRODUCT_ID_LIFETIME_PRO:
            case process.env.POLAR_PRODUCT_ID_LIFETIME_PLUS:
              console.log(`User bought Lifetime ${productId === process.env.POLAR_PRODUCT_ID_LIFETIME_PRO ? "Pro" : "Plus"}`);
              emailType = "premium_lifetime";
              isPremiumPurchase = true;

              // Cancel all existing subscriptions when lifetime is purchased
              const customerId = event.data.customer?.id || event.data.customer_id;
              if (customerId) {
                try {
                  console.log(`Cancelling all subscriptions for customer ${customerId} after lifetime purchase`);
                  const result = await ctx.runAction(internal.polar.cancelAllSubscriptionsForCustomer, {
                    customerId: customerId,
                  });
                  console.log(`Subscription cancellation result: ${result.cancelled} cancelled, ${result.errors.length} errors`);
                } catch (cancelError) {
                  console.error("Failed to cancel subscriptions after lifetime purchase:", cancelError);
                  // Don't fail the webhook if subscription cancellation fails
                }
              } else {
                console.warn("No customer ID found in lifetime purchase webhook data");
              }
              break;

            // 100 Credit Bundle product
            case process.env.POLAR_PRODUCT_ID_CREDIT_100:
              console.log("User bought 100 Credit Bundle");
              emailType = "credit_bundle";
              isCreditsBundle = true;
              break;

            default:
              console.log("User bought unknown product");
              console.log("Product ID received:", productId);
              console.log("Expected PLUS:", process.env.POLAR_PRODUCT_ID_MONTHLY_PLUS);
              console.log("Expected PRO:", process.env.POLAR_PRODUCT_ID_MONTHLY_PRO);
              console.log("Expected LIFETIME PRO:", process.env.POLAR_PRODUCT_ID_LIFETIME_PRO);
              console.log("Expected LIFETIME PLUS:", process.env.POLAR_PRODUCT_ID_LIFETIME_PLUS);
              console.log("Expected CREDIT_100:", process.env.POLAR_PRODUCT_ID_CREDIT_100);
          }

          // Add credits to user's account if this is a credit bundle purchase
          if (isCreditsBundle && customerEmail) {
            // Determine credits count: use metadata if available, otherwise fallback based on product
            let creditsToAdd = creditsCount;
            if (!creditsToAdd && productId === process.env.POLAR_PRODUCT_ID_CREDIT_100) {
              creditsToAdd = 100; // Fallback for 100-credit bundle
            }

            if (creditsToAdd) {
              try {
                // Look up user by email
                const userId = await ctx.runQuery(internal.users.getUserIdByEmail, {
                  email: customerEmail,
                });

                if (userId) {
                  // Add credits to the user's account
                  await ctx.runMutation(internal.credits.addCredits, {
                    userId: userId,
                    amount: creditsToAdd,
                  });
                  console.log(`Added ${creditsToAdd} credits to user ${userId}`);
                } else {
                  console.error(`No user found with email ${customerEmail} for credit purchase`);
                }
              } catch (creditError) {
                console.error("Failed to add credits:", creditError);
                // Don't fail the webhook if credits fail - email will still be sent
              }
            } else {
              console.warn("Could not determine credits count for credit bundle purchase");
            }
          }

          // Add 500 bonus credits for lifetime premium subscribers
          // Note: Monthly subscription credits are handled in 'subscription.created' for faster activation
          if (isPremiumPurchase && customerEmail) {
            try {
              const premiumUserId = await ctx.runQuery(internal.users.getUserIdByEmail, {
                email: customerEmail,
              });

              if (premiumUserId) {
                await ctx.runMutation(internal.credits.addCredits, {
                  userId: premiumUserId,
                  amount: 500,
                });
                console.log(`Added 500 bonus credits to lifetime subscriber ${premiumUserId}`);
              } else {
                console.error(`No user found with email ${customerEmail} for lifetime credit bonus`);
              }
            } catch (creditError) {
              console.error("Failed to add lifetime bonus credits:", creditError);
              // Don't fail the webhook if credits fail
            }
          }

          // Send purchase confirmation email
          if (customerEmail) {
            try {
              await ctx.runAction(internal.resend.sendPurchaseEmail, {
                to: customerEmail,
                userName: customerName,
                emailType: emailType,
                productName: productName,
                amount: amount,
                currency: currency,
                orderId: orderId,
                // Include credit bundle info if available
                credits: creditsCount,
                bundleName: bundleName,
              });
              console.log(`Purchase confirmation email sent to ${customerEmail}`);
            } catch (emailError) {
              console.error("Failed to send purchase email:", emailError);
              // Don't fail the webhook if email fails
            }
          } else {
            console.warn("No customer email found in webhook data");
          }
          break;

        // Subscription events - Handle subscription activation IMMEDIATELY for better UX
        // This fires much faster than order.paid (seconds vs 30-40+ seconds)
        case "subscription.created": {
          console.log("Subscription created:", event.data);
          const subData = event.data;
          const subProductId = subData.product_id;
          const subCheckoutId = subData.checkout_id;
          const subCustomerEmail = subData.customer?.email || subData.user?.email;
          const newSubscriptionId = subData.id;

          // Only process if this is a valid subscription (status can be 'active' or 'trialing')
          if (subData.status === "active" || subData.status === "trialing") {
            console.log(`[Subscription Created] Processing subscription with status: ${subData.status}`);

            // subscription changes are now handled by Polar's internal logic
            // or by the user manually via the customer portal.
            // We NO LONGER cancel other subscriptions automatically here.


            // Mark the pending checkout as paid immediately
            if (subCheckoutId) {
              try {
                // Generate a synthetic order ID since we don't have one yet
                const syntheticOrderId = `sub_${subData.id}`;
                await ctx.runMutation(internal.checkouts.markCheckoutPaid, {
                  checkoutId: subCheckoutId,
                  orderId: syntheticOrderId,
                });
                console.log(`[Subscription Created] Marked checkout ${subCheckoutId} as paid`);
              } catch (checkoutError) {
                console.error("[Subscription Created] Failed to mark checkout as paid:", checkoutError);
              }
            }

            // Add 500 bonus credits for premium subscribers
            if (subCustomerEmail) {
              try {
                const subUserId = await ctx.runQuery(internal.users.getUserIdByEmail, {
                  email: subCustomerEmail,
                });

                if (subUserId) {
                  await ctx.runMutation(internal.credits.addCredits, {
                    userId: subUserId,
                    amount: 500,
                  });
                  console.log(`[Subscription Created] Added 500 bonus credits to subscriber ${subUserId}`);
                } else {
                  console.error(`[Subscription Created] No user found with email ${subCustomerEmail}`);
                }
              } catch (creditError) {
                console.error("[Subscription Created] Failed to add bonus credits:", creditError);
              }
            }

            // Log product type for debugging
            switch (subProductId) {
              case process.env.POLAR_PRODUCT_ID_MONTHLY_PLUS:
                console.log("[Subscription Created] User subscribed to Plus Monthly");
                break;
              case process.env.POLAR_PRODUCT_ID_MONTHLY_PRO:
                console.log("[Subscription Created] User subscribed to Pro Monthly");
                break;
              default:
                console.log("[Subscription Created] Unknown product ID:", subProductId);
            }
          }
          break;
        }
        case "subscription.updated":
          console.log("Subscription updated:", event.data);
          if (event.data.customerCancellationReason) {
            console.log("Cancellation reason:", event.data.customerCancellationReason);
            console.log("Cancellation comment:", event.data.customerCancellationComment);
          }
          break;
        case "subscription.active":
          console.log("Subscription active:", event.data);
          break;
        case "subscription.canceled":
          console.log("Subscription canceled:", event.data);
          break;
        case "subscription.revoked":
          console.log("Subscription revoked:", event.data);
          break;


        default:
      }

      return new Response("", { status: 202 });
    } catch (error) {
      console.error("Webhook processing error:", error);
      return new Response("", { status: 500 });
    }
  }),
});

export default http;
