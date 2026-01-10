import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { checkRateLimit } from "./rateLimit";

// Feedback types
export const feedbackTypes = ["bug", "feature", "improvement", "other"] as const;
export type FeedbackType = (typeof feedbackTypes)[number];

// Submit feedback from authenticated user
export const submitFeedback = mutation({
    args: {
        type: v.union(
            v.literal("bug"),
            v.literal("feature"),
            v.literal("improvement"),
            v.literal("other")
        ),
        message: v.string(),
        page: v.optional(v.string()),
    },
    handler: async (ctx, { type, message, page }) => {
        const userId = await getAuthUserId(ctx);
        if (userId === null) {
            throw new Error("Must be logged in to submit feedback");
        }

        // Anti-spam: Block if 3+ submissions in 10 seconds
        const rateLimit = await checkRateLimit(ctx, userId, "feedback");
        if (!rateLimit.allowed) {
            throw new Error(rateLimit.message);
        }

        // Get user info for context
        const user = await ctx.db.get(userId);

        const feedbackId = await ctx.db.insert("feedback", {
            userId,
            userEmail: user?.email ?? null,
            userName: user?.name ?? null,
            type,
            message,
            page: page ?? null,
            status: "new",
            createdAt: Date.now(),
        });

        return { success: true, feedbackId };
    },
});

// Get all feedback (for admin dashboard later)
export const getAllFeedback = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (userId === null) {
            throw new Error("Must be logged in");
        }

        // In production, you'd check for admin role here
        // For now, return all feedback ordered by newest first
        return await ctx.db
            .query("feedback")
            .order("desc")
            .collect();
    },
});

// Get feedback submitted by current user
export const getMyFeedback = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (userId === null) {
            return [];
        }

        return await ctx.db
            .query("feedback")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .order("desc")
            .collect();
    },
});
