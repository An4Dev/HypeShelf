import { internalMutation } from "./_generated/server";

/**
 * Initialization function to verify the recommendations table exists and is accessible.
 * This function can be called manually or via a cron job to ensure the table is properly set up.
 * 
 * Note: In Convex, tables defined in schema.ts are automatically created when you run `npx convex dev`.
 * This function serves as a verification/health check.
 * 
 * To use this function:
 * 1. Run `npx convex dev` - tables are automatically created from schema.ts
 * 2. Optionally call this function to verify the table exists
 */
export const verifyRecommendationsTable = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Try to query the recommendations table to verify it exists
    // This will throw an error if the table doesn't exist
    const count = await ctx.db.query("recommendations").collect();
    
    // If we get here, the table exists and is accessible
    return {
      success: true,
      message: "Recommendations table verified and accessible",
      recordCount: count.length,
    };
  },
});
