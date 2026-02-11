"use client";

import { ReactNode, useEffect, useRef } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

/**
 * When the user is authenticated with Convex, ensure they have a user row so they can use the app.
 */
function ConvexUserSync() {
  const ensureCurrentUser = useMutation(api.users.ensureCurrentUser);
  const { isAuthenticated } = useConvexAuth();
  const didEnsure = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) {
      didEnsure.current = false;
      return;
    }
    if (didEnsure.current) return;
    didEnsure.current = true;
    ensureCurrentUser().catch(() => {
      didEnsure.current = false;
    });
  }, [isAuthenticated, ensureCurrentUser]);

  return null;
}

export default function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <ConvexUserSync />
      {children}
    </ConvexProviderWithClerk>
  );
}
