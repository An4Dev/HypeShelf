import { mutation, query } from "./_generated/server";

/**
 * Fetches the current user from the users table.
 * Returns the user if authenticated and they have a row; returns null if not authenticated or no row.
 * Does not throw when unauthenticated so the client can call it safely (e.g. with "skip" or before token is ready).
 */
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const clerkUserId = identity.subject;
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", clerkUserId))
      .unique();
  },
});

/**
 * Ensures the signed-in user has a row in the users table (creates one with role "user" if missing).
 * Call this after sign-in so the user can use the app without seeing "Account not registered".
 */
export const ensureCurrentUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const clerkUserId = identity.subject;
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", clerkUserId))
      .unique();

    if (existing) {
      return existing._id;
    }

    const now = Date.now();
    // Extract user information from Clerk identity
    // Combine first name (givenName) and last name (familyName) into fullName
    const firstName = typeof identity.givenName === "string" ? identity.givenName : "";
    const lastName = typeof identity.familyName === "string" ? identity.familyName : "";
    const fullName = firstName && lastName 
      ? `${firstName} ${lastName}`.trim()
      : typeof identity.name === "string" 
        ? identity.name 
        : undefined;
    
    const email = typeof identity.email === "string" ? identity.email : "";
    const username = typeof identity.username === "string" 
      ? identity.username 
      : typeof identity.email === "string"
        ? identity.email.split("@")[0]
        : `user_${clerkUserId.slice(0, 8)}`;
    
    return await ctx.db.insert("users", {
      clerkUserId,
      role: "user",
      fullName,
      username,
      email,
      createdAt: now,
    });
  },
});
