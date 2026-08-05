"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";

export default function NavHeader() {
  const { user, profile, loading, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isPremium = profile?.is_premium ?? false;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/85 backdrop-blur-xl">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <Link className="flex items-center gap-3" href="/">
              <Image
                alt="Pyro Prep Academy"
                className="h-16 w-auto object-contain sm:h-20"
                fetchPriority="high"
                height={188}
                priority
                sizes="(max-width: 768px) 160px, 188px"
                src="/logo.webp"
                width={440}
              />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label="Toggle menu"
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-zinc-900/60 px-3 py-2 text-zinc-200 transition-all hover:-translate-y-0.5 hover:border-amber-500/30 hover:text-white md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {mobileOpen ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>

          {/* Right side: conditional auth links */}
          <div className="hidden items-center gap-3 sm:gap-4 md:flex">
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-700 border-t-amber-400" />
            ) : user ? (
              <>
                <Link
                  href="/quiz"
                  className="text-sm font-medium text-zinc-300 transition-colors hover:text-zinc-100"
                >
                  Study Modules
                </Link>

                <Link
                  href="/dashboard#calculator"
                  className="text-sm font-medium text-zinc-300 transition-colors hover:text-zinc-100"
                >
                  Fallout Calculator
                </Link>

                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-zinc-300 transition-colors hover:text-zinc-100"
                >
                  Dashboard
                </Link>

                {isPremium && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
                    ★ Premium
                  </span>
                )}

                <button
                  type="button"
                  onClick={signOut}
                  className="text-sm font-medium text-zinc-300 transition-colors hover:text-white"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-zinc-300 transition-colors hover:text-zinc-100"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 text-sm font-bold text-zinc-950 shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-0.5 hover:from-amber-400 hover:to-orange-500 hover:shadow-orange-500/35 active:scale-[0.98]"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>

        {mobileOpen && (
          <div className="space-y-3 border-t border-white/10 pb-4 pt-4 md:hidden">
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-700 border-t-amber-400" />
            ) : user ? (
              <>
                <Link href="/quiz" className="block text-sm font-medium text-zinc-300 transition-colors hover:text-zinc-100">Study Modules</Link>
                <Link href="/dashboard#calculator" className="block text-sm font-medium text-zinc-300 transition-colors hover:text-zinc-100">Fallout Calculator</Link>
                <Link href="/dashboard" className="block text-sm font-medium text-zinc-300 transition-colors hover:text-zinc-100">Dashboard</Link>
                {isPremium && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">★ Premium</span>
                )}
                <button type="button" onClick={signOut} className="text-sm font-medium text-zinc-300 transition-colors hover:text-white">Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/login" className="block text-sm font-medium text-zinc-300 transition-colors hover:text-zinc-100">Sign In</Link>
                <Link href="/signup" className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 text-sm font-bold text-zinc-950 shadow-lg shadow-orange-500/20 transition-all active:scale-[0.98]">Get Started</Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}