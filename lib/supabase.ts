"use client";

import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client for use in client components (browser).
 * Uses environment variables for the project URL and anon key.
 *
 * NEXT_PUBLIC_SUPABASE_URL  – your Supabase project URL
 * NEXT_PUBLIC_SUPABASE_ANON_KEY – your Supabase anon / public key
 *
 * Performance note: `@supabase/ssr` (which pulls in the full supabase-js
 * runtime) is imported dynamically so it is code-split into its own chunk
 * and evaluated after first paint instead of blocking the main thread
 * during initial page load on every route.
 */
let clientPromise: Promise<SupabaseClient> | null = null;

export function createSupabaseClient(): Promise<SupabaseClient> {
  if (clientPromise) return clientPromise;

  clientPromise = (async () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url) {
      throw new Error(
        "NEXT_PUBLIC_SUPABASE_URL is not set. " +
          "Add it to your .env.local file from your Supabase project settings.",
      );
    }
    if (!anonKey) {
      throw new Error(
        "NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. " +
          "Add it to your .env.local file from your Supabase project settings.",
      );
    }

    const { createBrowserClient } = await import("@supabase/ssr");
    return createBrowserClient(url, anonKey);
  })();

  // Allow a retry if creation fails (e.g. missing env at first call).
  clientPromise.catch(() => {
    clientPromise = null;
  });

  return clientPromise;
}
