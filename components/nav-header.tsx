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
              <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-red-600 to-orange-500 text-white font-bold text-xs shadow-[0_0_18px_rgba(234,88,12,0.35)] shrink-0">
                P
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