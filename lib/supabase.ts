"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a Supabase client for use in client components (browser).
 * Uses environment variables for the project URL and anon key.
 *
 * NEXT_PUBLIC_SUPABASE_URL  – your Supabase project URL
 * NEXT_PUBLIC_SUPABASE_ANON_KEY – your Supabase anon / public key
 */
export function createSupabaseClient() {
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

  return createBrowserClient(url, anonKey);
}
