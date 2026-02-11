import type { AuthConfig } from "convex/server";

/**
 * Convex validates Clerk JWTs using this config.
 * Set CLERK_JWT_ISSUER_DOMAIN in your Convex Dashboard (Settings → Environment Variables)
 * to your Clerk "Frontend API" URL (e.g. https://xxx.clerk.accounts.dev).
 * Get it from: Clerk Dashboard → JWT Templates → "convex" template → Issuer.
 */
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN!,
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
