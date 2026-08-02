"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function NavHeader() {
  const { user, profile, loading, signOut } = useAuth();

  const isPremium = profile?.is_premium ?? false;

  return (
    <header className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/" className="flex items-center gap-2 min-w-0">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-tr from-amber-500 via-orange-500 to-red-600 shadow-[0_0_18px_rgba(234,88,12,0.45)] shrink-0">
                <svg
                  width="16"
                  height="18"
                  viewBox="0 0 16 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M8 0C8 0 2 10 2 13C2 16.3 4.7 18 8 18C11.3 18 14 16.3 14 13C14 10 8 5 8 0Z"
                    fill="white"
                    fillOpacity="0.95"
                  />
                  <path
                    d="M8 2.5C8 2.5 4.5 9.5 5 12.5C5.3 14.2 6.8 15.5 8 15.5C9.2 15.5 10.7 14.2 11 12.5C11.5 9.5 8 6 8 2.5Z"
                    fill="#F97316"
                    fillOpacity="0.7"
                  />
                </svg>
              </span>
              <span className="truncate text-sm font-semibold text-white tracking-tight">
                Pyro Prep Academy
              </span>
            </Link>
          </div>

          {/* Right side: conditional auth links */}
          <div className="flex items-center gap-3 sm:gap-4">
            {loading ? (
              <div className="w-4 h-4 rounded-full border-2 border-zinc-700 border-t-orange-500 animate-spin" />
            ) : user ? (
              <>
                {/* Dashboard link */}
                <Link
                  href="/dashboard"
                  className="text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-zinc-200 transition-colors hidden sm:inline-block"
                >
                  Dashboard
                </Link>

                {/* Premium indicator */}
                {isPremium && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-amber-400">
                    ★ Premium
                  </span>
                )}

                {/* Sign Out */}
                <button
                  type="button"
                  onClick={signOut}
                  className="text-xs font-mono uppercase tracking-wider text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white text-xs font-semibold uppercase tracking-wider px-3 py-1.5 transition-all shadow-[0_0_16px_rgba(234,88,12,0.25)]"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}