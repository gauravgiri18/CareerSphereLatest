"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MainError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[CareerSphere]", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16 max-w-lg text-center">
      <h1 className="text-2xl font-bold text-white mb-4">Something went wrong</h1>
      <p className="text-white/60 mb-6">{error.message}</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          onClick={reset}
          className="bg-white text-black hover:bg-white/90"
        >
          Try again
        </Button>
        <Link href="/dashboard">
          <Button
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 w-full"
          >
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
