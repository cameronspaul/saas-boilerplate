import { query, mutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { checkRateLimit } from "./rateLimit";

// Internal query to get user ID by email (used by webhooks)
export const getUserIdByEmail = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .first();
    return user?._id ?? null;
  },
});

// Get the current authenticated user's profile
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});

// Get a user by their ID
export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db.get(userId);
  },
});

// Update the current user's profile
export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Client is not authenticated");
    }

    // Anti-spam rate limiting for profile updates
    const rateLimit = await checkRateLimit(ctx, userId, "profile_update");
    if (!rateLimit.allowed) {
      throw new Error(rateLimit.message);
    }

    // Filter out undefined values to only update provided fields
    const updateData: any = {};
    if (args.name !== undefined) updateData.name = args.name;
    if (args.image !== undefined) updateData.image = args.image;
    if (args.email !== undefined) updateData.email = args.email;

    await ctx.db.patch(userId, updateData);
    return await ctx.db.get(userId);
  },
});

// Get all users (for admin purposes)
export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Client is not authenticated");
    }

    // In a real app, you might want to check if the user is an admin
    // For now, we'll just return all users
    return await ctx.db.query("users").collect();
  },
});

// Delete the current user and all related data
export const deleteUser = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Client is not authenticated");
    }

    // Delete all auth sessions for this user
    const authSessions = await ctx.db.query("authSessions")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    // Delete refresh tokens associated with these sessions first
    for (const session of authSessions) {
      const refreshTokens = await ctx.db.query("authRefreshTokens")
        .filter((q) => q.eq(q.field("sessionId"), session._id))
        .collect();
      for (const token of refreshTokens) {
        await ctx.db.delete(token._id);
      }
      // Then delete the session itself
      await ctx.db.delete(session._id);
    }

    // Delete all auth accounts for this user
    const authAccounts = await ctx.db.query("authAccounts")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
    for (const account of authAccounts) {
      await ctx.db.delete(account._id);
    }

    // Delete all credits for this user
    const credits = await ctx.db.query("credits")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    if (credits) {
      await ctx.db.delete(credits._id);
    }

    // Delete all feedback for this user
    const feedbackList = await ctx.db.query("feedback")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
    for (const feedback of feedbackList) {
      await ctx.db.delete(feedback._id);
    }

    // Finally, delete the user record
    await ctx.db.delete(userId);

    return { success: true };
  },
});