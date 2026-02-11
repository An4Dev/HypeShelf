import { type MutationCtx, mutation, query } from "./_generated/server";
import { v } from "convex/values";

const PUBLIC_LIST_LIMIT = 50;

/** Requires auth; returns identity and user. Throws if user row does not exist. */
async function requireCurrentUser(ctx: MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", identity.subject))
    .unique();
  if (!user) {
    throw new Error("User record not found. Sign up first by creating a recommendation.");
  }
  return { identity, user };
}

/** Gets identity and user; creates a user with role "user" if none exists. Use only when the user is "signing up" (e.g. first recommendation). */
async function ensureCurrentUser(ctx: MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  const clerkUserId = identity.subject;
  let user = await ctx.db
    .query("users")
    .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", clerkUserId))
    .unique();
  if (!user) {
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
    
    const userId = await ctx.db.insert("users", {
      clerkUserId,
      role: "user",
      fullName,
      username,
      email,
      createdAt: now,
    });
    user = (await ctx.db.get(userId))!;
  }
  return { identity, user };
}

/**
 * Creates a recommendation owned by the current user.
 * Requires authentication. isStaffPick defaults to false.
 * Uses user's fullName or username from database for "Added by".
 * @param args.title - Recommendation title
 * @param args.genre - Genre(s), comma-separated for multiple
 * @param args.link - URL (e.g. YouTube, article)
 * @param args.blurb - Short description
 */
export const createRecommendation = mutation({
  args: {
    title: v.string(),
    genre: v.string(),
    link: v.string(),
    blurb: v.string(),
  },
  handler: async (ctx, args) => {
    // Create user on first recommendation (sign-up); do not create on sign-in only.
    const { identity, user } = await ensureCurrentUser(ctx);
    // Use fullName if available, otherwise fall back to username
    const userName = user.fullName || user.username;
    const now = Date.now();
    await ctx.db.insert("recommendations", {
      title: args.title,
      genre: args.genre,
      link: args.link,
      blurb: args.blurb,
      userId: identity.subject,
      userName: userName,
      isStaffPick: false,
      createdAt: now,
    });
  },
});

/**
 * Requires authentication.
 * Allowed if caller is admin OR the recommendation belongs to the caller.
 * Otherwise throws.
 */
export const deleteRecommendation = mutation({
  args: {
    recommendationId: v.id("recommendations"),
  },
  handler: async (ctx, args) => {
    const { identity, user } = await requireCurrentUser(ctx);
    const rec = await ctx.db.get(args.recommendationId);
    if (!rec) {
      throw new Error("Recommendation not found");
    }
    const isAdmin = user.role === "admin";
    const isOwner = rec.userId === identity.subject;
    if (!isAdmin && !isOwner) {
      throw new Error("Unauthorized: you may only delete your own recommendations, or be an admin.");
    }
    await ctx.db.delete(args.recommendationId);
  },
});

/**
 * Requires authentication.
 * Updates a recommendation. Allowed if caller is admin OR the recommendation belongs to the caller.
 * Otherwise throws. Uses user's fullName or username from database for "Added by".
 * @param args.recommendationId - ID of the recommendation to update
 * @param args.title - Updated recommendation title
 * @param args.genre - Updated genre(s), comma-separated for multiple
 * @param args.link - Updated URL
 * @param args.blurb - Updated short description
 */
export const updateRecommendation = mutation({
  args: {
    recommendationId: v.id("recommendations"),
    title: v.string(),
    genre: v.string(),
    link: v.string(),
    blurb: v.string(),
  },
  handler: async (ctx, args) => {
    const { identity, user } = await requireCurrentUser(ctx);
    const rec = await ctx.db.get(args.recommendationId);
    if (!rec) {
      throw new Error("Recommendation not found");
    }
    const isAdmin = user.role === "admin";
    const isOwner = rec.userId === identity.subject;
    if (!isAdmin && !isOwner) {
      throw new Error("Unauthorized: you may only edit your own recommendations, or be an admin.");
    }
    // Use fullName if available, otherwise fall back to username
    const userName = user.fullName || user.username;
    await ctx.db.patch(args.recommendationId, {
      title: args.title,
      genre: args.genre,
      link: args.link,
      blurb: args.blurb,
      userName: userName,
    });
  },
});

/**
 * Requires authentication. Admin-only.
 * Toggles the isStaffPick field for the given recommendation.
 */
export const markStaffPick = mutation({
  args: {
    recommendationId: v.id("recommendations"),
  },
  handler: async (ctx, args) => {
    const { user } = await requireCurrentUser(ctx);
    if (user.role !== "admin") {
      throw new Error("Unauthorized: only admins can mark staff picks.");
    }
    const rec = await ctx.db.get(args.recommendationId);
    if (!rec) {
      throw new Error("Recommendation not found");
    }
    await ctx.db.patch(args.recommendationId, {
      isStaffPick: !rec.isStaffPick,
    });
  },
});

/**
 * Gets a single recommendation by ID. Public, read-only.
 * Returns null if not found.
 */
export const getRecommendationById = query({
  args: {
    recommendationId: v.id("recommendations"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.recommendationId);
  },
});

/**
 * Public, read-only. Returns latest recommendations sorted by createdAt descending.
 * No auth required. Used by the home page recommendations list.
 * Includes username from users table.
 */
export const getPublicRecommendations = query({
  args: {},
  handler: async (ctx) => {
    const recs = await ctx.db
      .query("recommendations")
      .withIndex("by_created_at", (q) => q)
      .order("desc")
      .take(PUBLIC_LIST_LIMIT);
    
    // Join with users table to get username
    return await Promise.all(
      recs.map(async (rec) => {
        const user = await ctx.db
          .query("users")
          .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", rec.userId))
          .unique();
        return {
          ...rec,
          username: user?.username || rec.userName, // Fallback to userName if user not found
        };
      })
    );
  },
});

/**
 * Requires authentication. Returns all recommendations with ownership info.
 */
export const getAllRecommendations = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    return await ctx.db
      .query("recommendations")
      .withIndex("by_created_at", (q) => q)
      .order("desc")
      .collect();
  },
});
