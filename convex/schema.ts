import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const schema = defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    // Additional fields for comprehensive profile
    creationDate: v.number(), // Store creation timestamp
    provider: v.optional(v.string()), // Track which OAuth provider was used
    providerId: v.optional(v.string()), // Unique ID from the provider
  })
    .index("email", ["email"])
    .index("by_provider", ["provider"]),

  // Credits table - stores user credit balances
  credits: defineTable({
    userId: v.id("users"),
    balance: v.number(), // Current credit balance
    lastUpdated: v.number(), // Timestamp of last update
  })
    .index("by_userId", ["userId"]),

  // Feedback table - stores user feedback submissions
  feedback: defineTable({
    userId: v.id("users"),
    userEmail: v.union(v.string(), v.null()),
    userName: v.union(v.string(), v.null()),
    type: v.union(
      v.literal("bug"),
      v.literal("feature"),
      v.literal("improvement"),
      v.literal("other")
    ),
    message: v.string(),
    page: v.union(v.string(), v.null()),
    status: v.union(
      v.literal("new"),
      v.literal("reviewed"),
      v.literal("resolved"),
      v.literal("dismissed")
    ),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_status", ["status"])
    .index("by_type", ["type"]),

  // Rate limiting table - tracks user actions for anti-spam protection
  rateLimits: defineTable({
    userId: v.id("users"),
    action: v.string(), // Action type: "feedback", "credit_use", etc.
    timestamp: v.number(), // When the action occurred
  })
    .index("by_user_action", ["userId", "action"])
    .index("by_timestamp", ["timestamp"]), // For cleanup of old records

  // Processed orders table - tracks Polar order IDs to prevent duplicate processing
  processedOrders: defineTable({
    orderId: v.string(), // Polar order ID
    eventType: v.string(), // Event type (e.g., "order.paid")
    productId: v.string(), // Product ID for reference
    userId: v.optional(v.id("users")), // User who received credits
    creditsAdded: v.number(), // Amount of credits added
    processedAt: v.number(), // Timestamp when processed
  })
    .index("by_orderId", ["orderId"]),

  // Pending checkouts table - tracks checkout sessions awaiting payment confirmation
  pendingCheckouts: defineTable({
    checkoutId: v.string(), // Polar checkout ID
    userId: v.id("users"), // User who initiated the checkout
    expectedTier: v.string(), // Expected subscription tier
    productId: v.string(), // Product ID being purchased
    status: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("failed")
    ),
    orderId: v.optional(v.string()), // Order ID once paid
    paidAt: v.optional(v.number()), // Timestamp when paid
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_checkoutId", ["checkoutId"])
    .index("by_userId_status", ["userId", "status"]),
});

export default schema;