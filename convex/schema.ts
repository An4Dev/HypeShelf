import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Convex Schema Definition
 * 
 * IMPORTANT: Tables defined in this schema are AUTOMATICALLY CREATED when you run `npx convex dev`.
 * You don't need to manually create tables - Convex handles this automatically based on your schema definition.
 * 
 * When you run `npx convex dev`:
 * 1. Convex watches your schema.ts file for changes
 * 2. Automatically creates/updates tables in your dev deployment
 * 3. Creates indexes as defined
 * 
 * The recommendations table will be automatically available once you start the dev server.
 */

const userRole = v.union(v.literal("admin"), v.literal("user"));

export default defineSchema({
  users: defineTable({
    clerkUserId: v.string(),
    role: userRole,
    fullName: v.optional(v.string()),
    username: v.string(),
    email: v.string(),
    createdAt: v.number(),
  })
    .index("by_clerk_user_id", ["clerkUserId"])
    .index("by_username", ["username"])
    .index("by_email", ["email"]),

  recommendations: defineTable({
    title: v.string(),
    genre: v.string(),
    link: v.string(),
    blurb: v.string(),
    userId: v.string(),
    userName: v.string(),
    isStaffPick: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_created_at", ["createdAt"])
    .index("by_user_id", ["userId"]),
});
