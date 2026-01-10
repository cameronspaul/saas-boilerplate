/**
 * Anti-Spam Protection (Burst Detection Only)
 * 
 * Simple burst-based rate limiting that only blocks rapid-fire spam.
 * Normal usage is never restricted - only catches obvious abuse.
 * 
 * Usage:
 *   const limiter = await checkRateLimit(ctx, userId, "feedback");
 *   if (!limiter.allowed) {
 *     throw new Error(limiter.message);
 *   }
 */

import { MutationCtx, internalMutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Burst detection configs: how many actions in how many seconds triggers block
export const RATE_LIMIT_CONFIGS = {
    // Feedback: Block if 3+ submissions in 10 seconds
    feedback: {
        burstLimit: 3,
        burstWindowSeconds: 10,
    },
    // Credit usage: Block if 10+ uses in 10 seconds
    credit_use: {
        burstLimit: 10,
        burstWindowSeconds: 10,
    },
    // Profile updates: Block if 5+ updates in 10 seconds
    profile_update: {
        burstLimit: 5,
        burstWindowSeconds: 10,
    },
    // Generic default
    default: {
        burstLimit: 5,
        burstWindowSeconds: 10,
    },
} as const;

export type RateLimitAction = keyof typeof RATE_LIMIT_CONFIGS;

interface RateLimitConfig {
    burstLimit: number;          // Max actions in burst window before blocking
    burstWindowSeconds: number;  // Time window for burst detection
}

interface RateLimitResult {
    allowed: boolean;
    retryAfterSeconds?: number;  // When they can try again
    message: string;
}

/**
 * Check if a user action should be rate limited (burst detection only)
 * Returns whether the action is allowed and records the attempt
 */
export async function checkRateLimit(
    ctx: MutationCtx,
    userId: Id<"users">,
    action: RateLimitAction | string,
    customConfig?: Partial<RateLimitConfig>
): Promise<RateLimitResult> {
    const now = Date.now();

    // Get config (use predefined or default, with optional overrides)
    const baseConfig = RATE_LIMIT_CONFIGS[action as RateLimitAction] ?? RATE_LIMIT_CONFIGS.default;
    const config: RateLimitConfig = {
        burstLimit: customConfig?.burstLimit ?? baseConfig.burstLimit,
        burstWindowSeconds: customConfig?.burstWindowSeconds ?? baseConfig.burstWindowSeconds,
    };

    const burstWindowStart = now - (config.burstWindowSeconds * 1000);

    // Count recent actions in the burst window
    const recentActions = await ctx.db
        .query("rateLimits")
        .withIndex("by_user_action", (q) =>
            q.eq("userId", userId).eq("action", action)
        )
        .filter((q) => q.gte(q.field("timestamp"), burstWindowStart))
        .collect();

    // Check for spam burst behavior
    if (recentActions.length >= config.burstLimit) {
        return {
            allowed: false,
            retryAfterSeconds: config.burstWindowSeconds,
            message: "Slow down! Too many requests. Please wait a moment.",
        };
    }

    // Action is allowed - record it
    await ctx.db.insert("rateLimits", {
        userId,
        action,
        timestamp: now,
    });

    return {
        allowed: true,
        message: "OK",
    };
}

/**
 * Cleanup old rate limit records (call periodically or via cron)
 * Removes records older than 1 hour to keep the table small
 */
export async function cleanupOldRateLimits(ctx: MutationCtx): Promise<number> {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);

    const oldRecords = await ctx.db
        .query("rateLimits")
        .withIndex("by_timestamp", (q) => q.lt("timestamp", oneHourAgo))
        .take(100); // Batch delete to avoid timeouts

    for (const record of oldRecords) {
        await ctx.db.delete(record._id);
    }

    return oldRecords.length;
}

/**
 * Get rate limit status for a user without recording an action
 * Useful for showing remaining attempts in UI
 */
export async function getRateLimitStatus(
    ctx: MutationCtx,
    userId: Id<"users">,
    action: RateLimitAction | string
): Promise<{ remaining: number; windowSeconds: number }> {
    const now = Date.now();
    const config = RATE_LIMIT_CONFIGS[action as RateLimitAction] ?? RATE_LIMIT_CONFIGS.default;
    const burstWindowStart = now - (config.burstWindowSeconds * 1000);

    const recentActions = await ctx.db
        .query("rateLimits")
        .withIndex("by_user_action", (q) =>
            q.eq("userId", userId).eq("action", action)
        )
        .filter((q) => q.gte(q.field("timestamp"), burstWindowStart))
        .collect();

    const remaining = Math.max(0, config.burstLimit - recentActions.length);

    return { remaining, windowSeconds: config.burstWindowSeconds };
}

/**
 * Internal mutation for scheduled cleanup - call via cron
 * Example cron setup in convex/crons.ts:
 *   crons.interval("cleanup rate limits", { hours: 1 }, internal.rateLimit.scheduledCleanup)
 */
export const scheduledCleanup = internalMutation({
    args: {},
    handler: async (ctx) => {
        const deleted = await cleanupOldRateLimits(ctx);
        if (deleted > 0) {
            console.log(`Rate limit cleanup: deleted ${deleted} old records`);
        }
        return { deleted };
    },
});
