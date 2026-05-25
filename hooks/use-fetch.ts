"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

export function useFetch<T, A extends unknown[]>(
  cb: (...args: A) => Promise<T>
) {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fn = useCallback(
    async (...args: A) => {
      setLoading(true);
      try {
        const response = await cb(...args);
        setData(response);
        setError(null);
        return response;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Something went wrong");
        setError(error);
        toast.error(error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [cb]
  );

  return { data, loading, error, fn, setData };
}
