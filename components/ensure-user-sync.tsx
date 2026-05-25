"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { checkUser } from "@/actions/user";
import { toast } from "sonner";

export function EnsureUserSync() {
  const { isSignedIn, isLoaded } = useAuth();
  const synced = useRef(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || synced.current) return;

    synced.current = true;
    checkUser().catch((err) => {
      synced.current = false;
      const message =
        err instanceof Error ? err.message : "Failed to sync account";
      console.error("[CareerSphere] User sync failed:", err);
      toast.error(message);
    });
  }, [isLoaded, isSignedIn]);

  return null;
}
