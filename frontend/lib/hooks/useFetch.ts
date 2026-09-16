"use client";

import { useState, useCallback } from "react";
import { apiFetch, ApiError } from "@/lib/api/client";

interface FetchError {
  message: string;
  status: number;
}

export function useFetch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<FetchError | null>(null);

  const request = useCallback(
    async <T = unknown>(url: string, options: RequestInit = {}): Promise<T> => {
      setLoading(true);
      setError(null);
      try {
        return await apiFetch<T>(url, options);
      } catch (err) {
        const apiErr = err as ApiError;
        setError({
          message: apiErr.message ?? "Erro desconhecido",
          status: apiErr.status ?? 500,
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const get = useCallback(
    <T = unknown>(url: string) => request<T>(url),
    [request],
  );
  const post = useCallback(
    <T = unknown>(url: string, body: unknown) =>
      request<T>(url, { method: "POST", body: JSON.stringify(body) }),
    [request],
  );
  const remove = useCallback(
    <T = unknown>(url: string) => request<T>(url, { method: "DELETE" }),
    [request],
  );
  const put = useCallback(
    <T = unknown>(url: string, body: unknown) =>
      request<T>(url, { method: "PUT", body: JSON.stringify(body) }),
    [request],
  );

  return { get, post, remove, put, request, loading, error };
}
