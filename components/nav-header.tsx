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
    <header className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 min-w-0">
            <Link className="flex items-center gap-2 h-20" href="/">
              <Image
                alt="Pyro Prep Academy"
                className="h-20 w-auto object-contain"
                fetchPriority="high"
                height={188}
                priority
                sizes="190px"
                src="/logo.webp"
                width={440}
              />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label="Toggle menu"
            className="md:hidden inline-flex items-center justify-center rounded-md border border-zinc-800 bg-zinc-900/40 px-3 py-2 text-zinc-200 hover:text-white"
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
          <div className="hidden md:flex items-center gap-3 sm:gap-4">
            {loading ? (
              <div className="w-4 h-4 rounded-full border-2 border-zinc-700 border-t-orange-500 animate-spin" />
            ) : user ? (
              <>
                {/* Study Modules */}
                <Link
                  href="/quiz"
                  className="text-xs font-mono uppercase tracking-wider text-zinc-300 hover:text-zinc-100 transition-colors"
                >
                  Study Modules
                </Link>

                {/* Fallout Calculator */}
                <Link
                  href="/dashboard#calculator"
                  className="text-xs font-mono uppercase tracking-wider text-zinc-300 hover:text-zinc-100 transition-colors"
                >
                  Fallout Calculator
                </Link>

                {/* Dashboard link */}
                <Link
                  href="/dashboard"
                  className="text-xs font-mono uppercase tracking-wider text-zinc-300 hover:text-zinc-100 transition-colors"
                >
                  Dashboard
                </Link>

                {/* Premium indicator */}
                {isPremium && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-amber-400">
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
                  className="text-xs font-mono uppercase tracking-wider text-zinc-300 hover:text-zinc-100 transition-colors"
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

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-zinc-800 pb-4 pt-4 space-y-3">
            {loading ? (
              <div className="w-4 h-4 rounded-full border-2 border-zinc-700 border-t-orange-500 animate-spin" />
            ) : user ? (
              <>
                <Link href="/quiz" className="block text-xs font-mono uppercase tracking-wider text-zinc-300">Study Modules</Link>
                <Link href="/dashboard#calculator" className="block text-xs font-mono uppercase tracking-wider text-zinc-300">Fallout Calculator</Link>
                <Link href="/dashboard" className="block text-xs font-mono uppercase tracking-wider text-zinc-300">Dashboard</Link>
                {isPremium && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-amber-400">★ Premium</span>
                )}
                <button type="button" onClick={signOut} className="text-xs font-mono uppercase tracking-wider text-zinc-300 hover:text-white">Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/login" className="block text-xs font-mono uppercase tracking-wider text-zinc-300">Sign In</Link>
                <Link href="/signup" className="inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-semibold uppercase tracking-wider px-3 py-2">Get Started</Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
