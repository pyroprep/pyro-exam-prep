"use client";

import Image from "next/image";
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
            <Link className="flex items-center gap-2 h-10" href="/">
              <Image
                alt="Pyro Prep Academy"
                className="h-10 w-auto object-contain"
                height={41}
                priority
                sizes="(max-width: 768px) 150px, 180px"
                src="/logo.png"
                width={180}
              />
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
                  className="text-xs font-mono uppercase tracking-wider text-zinc-300 hover:text-white transition-colors"
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