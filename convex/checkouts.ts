import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Create a pending checkout record when the user initiates a checkout session.
 * This allows us to track the checkout and wait for the webhook confirmation.
 */
export const createPendingCheckout = mutation({
    args: {
        checkoutId: v.string(),
        expectedTier: v.string(),
        productId: v.string(),
    },
    handler: async (ctx, { checkoutId, expectedTier, productId }) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }

        // Check if checkout already exists
        const existing = await ctx.db
            .query("pendingCheckouts")
            .withIndex("by_checkoutId", (q) => q.eq("checkoutId", checkoutId))
            .first();

        if (existing) {
            return existing._id;
        }

        const now = Date.now();
        return await ctx.db.insert("pendingCheckouts", {
            checkoutId,
            userId,
            expectedTier,
            productId,
            status: "pending",
            createdAt: now,
            updatedAt: now,
        });
    },
});

/**
 * Get the status of a pending checkout by its ID.
 * Used by the frontend to poll for payment confirmation.
 */
export const getCheckoutStatus = query({
    args: {
        checkoutId: v.string(),
    },
    handler: async (ctx, { checkoutId }) => {
        const checkout = await ctx.db
            .query("pendingCheckouts")
            .withIndex("by_checkoutId", (q) => q.eq("checkoutId", checkoutId))
            .first();

        if (!checkout) {
            return null;
        }

        return {
            status: checkout.status,
            expectedTier: checkout.expectedTier,
            orderId: checkout.orderId,
            paidAt: checkout.paidAt,
        };
    },
});

/**
 * Mark a checkout as paid when we receive the order.paid webhook.
 * Called internally from the webhook handler.
 */
export const markCheckoutPaid = internalMutation({
    args: {
        checkoutId: v.string(),
        orderId: v.string(),
    },
    handler: async (ctx, { checkoutId, orderId }) => {
        const checkout = await ctx.db
            .query("pendingCheckouts")
            .withIndex("by_checkoutId", (q) => q.eq("checkoutId", checkoutId))
            .first();

        if (!checkout) {
            // Checkout might not exist if the user didn't go through our flow
            // (e.g., direct Polar link). That's okay.
            console.log(`[markCheckoutPaid] No pending checkout found for ${checkoutId}`);
            return null;
        }

        await ctx.db.patch(checkout._id, {
            status: "paid",
            orderId,
            paidAt: Date.now(),
            updatedAt: Date.now(),
        });

        console.log(`[markCheckoutPaid] Marked checkout ${checkoutId} as paid with order ${orderId}`);
        return checkout._id;
    },
});

/**
 * Mark a checkout as failed.
 */
export const markCheckoutFailed = internalMutation({
    args: {
        checkoutId: v.string(),
    },
    handler: async (ctx, { checkoutId }) => {
        const checkout = await ctx.db
            .query("pendingCheckouts")
            .withIndex("by_checkoutId", (q) => q.eq("checkoutId", checkoutId))
            .first();

        if (!checkout) {
            return null;
        }

        await ctx.db.patch(checkout._id, {
            status: "failed",
            updatedAt: Date.now(),
        });

        return checkout._id;
    },
});

/**
 * Get the most recent pending checkout for the current user.
 * Useful for recovery if the user navigates away and comes back.
 */
export const getMyPendingCheckout = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            return null;
        }

        const checkout = await ctx.db
            .query("pendingCheckouts")
            .withIndex("by_userId_status", (q) =>
                q.eq("userId", userId).eq("status", "pending")
            )
            .order("desc")
            .first();

        return checkout;
    },
});
