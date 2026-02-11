"use client";

import { useClerk } from "@clerk/nextjs";
import { useQuery, useConvexAuth } from "convex/react";
import { usePathname } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { useCallback, useState } from "react";

const SIGN_UP_PATH = "/sign-up";

/**
 * When the user is signed in (Clerk) but has no Convex user row (hasn't signed up in our app),
 * show a warning modal and direct them to sign up.
 */
export default function UnregisteredUserGuard() {
  const { isAuthenticated: isConvexAuthenticated } = useConvexAuth();
  const clerk = useClerk();
  const pathname = usePathname();
  // Only call getCurrentUser when Convex has the auth token (isAuthenticated); otherwise the query throws "Not authenticated"
  const currentUser = useQuery(
    api.users.getCurrentUser,
    isConvexAuthenticated ? {} : "skip"
  );
  const [isRedirecting, setIsRedirecting] = useState(false);

  const isAuthPage =
    pathname?.startsWith("/sign-in") || pathname?.startsWith("/sign-up");

  const handleGoToSignUp = useCallback(async () => {
    if (!clerk || isRedirecting) return;
    setIsRedirecting(true);
    await clerk.signOut({ redirectUrl: SIGN_UP_PATH });
    setIsRedirecting(false);
  }, [clerk, isRedirecting]);

  // Only consider "not registered" when Convex is authenticated and has finished loading (not undefined) and returned null
  const isRegistered = currentUser !== null && currentUser !== undefined;
  const isLoading = currentUser === undefined;
  const showWarning =
    !isAuthPage && isConvexAuthenticated && !isLoading && !isRegistered;

  if (!showWarning) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="unregistered-title"
    >
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900">
        <h2
          id="unregistered-title"
          className="text-lg font-semibold text-zinc-900 dark:text-zinc-100"
        >
          Account not registered
        </h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          You signed in with an email address that isn’t registered. Please sign
          up to create an account and use the app.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleGoToSignUp}
            disabled={isRedirecting}
            className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {isRedirecting ? "Redirecting…" : "Go to sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}
