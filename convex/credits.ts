import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { checkRateLimit } from "./rateLimit";

// Get the current user's credit balance
export const getBalance = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (userId === null) {
            return null;
        }

        const credits = await ctx.db
            .query("credits")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .first();

        return credits?.balance ?? 0;
    },
});

// Internal mutation to add credits (called from webhook handler)
export const addCredits = internalMutation({
    args: {
        userId: v.id("users"),
        amount: v.number(),
    },
    handler: async (ctx, { userId, amount }) => {
        const now = Date.now();

        // Get or create credits record for user
        const existingCredits = await ctx.db
            .query("credits")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .first();

        if (existingCredits) {
            // Update existing credits
            await ctx.db.patch(existingCredits._id, {
                balance: existingCredits.balance + amount,
                lastUpdated: now,
            });
        } else {
            // Create new credits record
            await ctx.db.insert("credits", {
                userId,
                balance: amount,
                lastUpdated: now,
            });
        }

        console.log(`Added ${amount} credits to user ${userId}`);
        return { success: true, newBalance: (existingCredits?.balance ?? 0) + amount };
    },
});

// User-facing mutation to use credits (for features that consume credits)
export const useCredits = mutation({
    args: {
        amount: v.number(),
    },
    handler: async (ctx, { amount }) => {
        const userId = await getAuthUserId(ctx);
        if (userId === null) {
            throw new Error("Not authenticated");
        }

        if (amount <= 0) {
            throw new Error("Amount must be positive");
        }

        // Anti-spam: Block if 10+ uses in 10 seconds
        const rateLimit = await checkRateLimit(ctx, userId, "credit_use");
        if (!rateLimit.allowed) {
            throw new Error(rateLimit.message);
        }

        const existingCredits = await ctx.db
            .query("credits")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .first();

        if (!existingCredits || existingCredits.balance < amount) {
            throw new Error("Insufficient credits");
        }

        const now = Date.now();
        const newBalance = existingCredits.balance - amount;

        // Deduct credits
        await ctx.db.patch(existingCredits._id, {
            balance: newBalance,
            lastUpdated: now,
        });

        return {
            success: true,
            remainingBalance: newBalance,
        };
    },
});

// Check if user has enough credits
export const hasCredits = query({
    args: {
        amount: v.number(),
    },
    handler: async (ctx, { amount }) => {
        const userId = await getAuthUserId(ctx);
        if (userId === null) {
            return false;
        }

        const credits = await ctx.db
            .query("credits")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .first();

        return credits ? credits.balance >= amount : false;
    },
});
