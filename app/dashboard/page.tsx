"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

// ─── Circular Progress Ring ──────────────────────────────────────────────────
function CircularProgressRing({
  percentage,
  label,
  size = 120,
  strokeWidth = 10,
}: {
  percentage: number;
  label: string;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="-rotate-90"
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="oklch(0.269 0 0)"
            strokeWidth={strokeWidth}
          />
          {/* Foreground arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="oklch(0.627 0.194 38.4)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-orange-500">
            {percentage}%
          </span>
        </div>
      </div>
      <p className="text-xs text-zinc-400 font-mono uppercase tracking-widest text-center">
        {label}
      </p>
    </div>
  );
}

// ─── Lock Icon ───────────────────────────────────────────────────────────────
function GoldLockIcon() {
  return (
    <svg
      className="w-6 h-6 text-amber-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  );
}

// ─── Premium Badge ────────────────────────────────────────────────────────────
function PremiumBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-mono uppercase tracking-wider text-amber-400">
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
      Premium
    </span>
  );
}

// ─── License Track Selector Card ──────────────────────────────────────────────
function LicenseTrackCard({
  title,
  description,
  locked,
  href,
  isPremium,
}: {
  title: string;
  description: string;
  locked?: boolean;
  href?: string;
  isPremium: boolean;
}) {
  // If the card is locked and the user is NOT premium, clicking goes to /pricing
  const targetHref = locked && !isPremium ? "/pricing" : href;

  const card = (
    <div
      className={`relative rounded-xl border p-6 h-full flex flex-col gap-4 transition-all duration-200 ${
        locked && !isPremium
          ? "border-zinc-800 bg-zinc-900/20 opacity-50 cursor-not-allowed"
          : "border-zinc-800 bg-zinc-900/40 hover:border-orange-500/50 hover:bg-zinc-900/60 cursor-pointer group"
      }`}
    >
      {/* Title row with optional lock */}
      <div className="flex items-center justify-between">
        <h3
          className={`text-sm font-semibold uppercase tracking-wider ${
            locked && !isPremium
              ? "text-zinc-500"
              : "text-zinc-200 group-hover:text-orange-400 transition-colors"
          }`}
        >
          {title}
        </h3>
        {/* Show lock icon only if locked AND not premium */}
        {locked && !isPremium && <GoldLockIcon />}
        {/* Show premium badge if it's a premium track and user is premium */}
        {locked && isPremium && <PremiumBadge />}
      </div>

      {/* Description */}
      <p className="text-xs text-zinc-500 leading-relaxed">{description}</p>

      {/* Unlocked / Premium active prompt */}
      {(!locked || isPremium) && (
        <div className="mt-auto pt-2">
          <span className="text-xs font-medium text-orange-500 group-hover:text-orange-400 transition-colors inline-flex items-center gap-1.5 uppercase tracking-wider">
            {locked && isPremium ? "Enter Exam" : "Enter Exam"}
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </div>
      )}

      {/* If locked and not premium, show upgrade prompt */}
      {locked && !isPremium && (
        <div className="mt-auto pt-2">
          <span className="text-xs font-medium text-amber-500/70 inline-flex items-center gap-1.5 uppercase tracking-wider">
            Upgrade to Access
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </span>
        </div>
      )}
    </div>
  );

  if (targetHref) {
    return <Link href={targetHref}>{card}</Link>;
  }
  return card;
}

// ─── Sidebar Nav Item ────────────────────────────────────────────────────────
function NavItem({
  label,
  icon,
  href,
}: {
  label: string;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30 transition-all duration-200 border border-transparent font-mono uppercase tracking-wider"
    >
      {icon}
      {label}
    </Link>
  );
}

// ─── Dashboard Page ──────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { profile, loading, user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isPremium = profile?.is_premium ?? false;

  return (
    <div className="flex min-h-screen">
      {/* ── Mobile Hamburger ──────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-500 hover:text-zinc-300"
        aria-label="Toggle navigation"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* ── Left Navigation (Sticky, Static) ──────────────────────────── */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-60 border-r border-zinc-800 bg-zinc-950/95 backdrop-blur-sm flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-zinc-800">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span className="font-bold text-zinc-100 tracking-tight">
              PyroPrep
            </span>
            <span className="text-[10px] font-mono text-zinc-700 uppercase tracking-widest ml-auto">
              v2.0
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1">
          <NavItem
            label="EXAM DESK"
            href="/dashboard/exam"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            }
          />
          <NavItem
            label="PERMIT LOGS"
            href="#"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            }
          />
          <NavItem
            label="STUDY GUIDE"
            href="#"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            }
          />
        </nav>

        {/* User info & logout at bottom */}
        <div className="p-4 border-t border-zinc-800 space-y-2">
          {/* Mini user row */}
          {user && (
            <div className="px-4 py-2 rounded-lg bg-zinc-900/30 border border-zinc-800/50">
              <p className="text-xs text-zinc-400 font-mono truncate">
                {user.email}
              </p>
              <div className="flex items-center gap-2 mt-1">
                {isPremium ? (
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">
                    ★ Premium
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
                    Basic
                  </span>
                )}
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={signOut}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30 transition-all duration-200 border border-transparent font-mono uppercase tracking-wider w-full"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* ── Mobile overlay ────────────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Main Content Area ─────────────────────────────────────────── */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
        {/* Header greeting */}
        <div className="mb-10">
          {loading ? (
            <div className="space-y-2">
              <div className="h-8 w-48 bg-zinc-800/50 rounded animate-pulse" />
              <div className="h-4 w-64 bg-zinc-800/30 rounded animate-pulse" />
            </div>
          ) : (
            <>
              <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
                Welcome{user?.email ? `, ${user.email.split("@")[0]}` : " Back"}
              </h1>
              <p className="text-zinc-500 mt-1 text-sm font-mono uppercase tracking-wider">
                Track your exam readiness and access practice materials.
              </p>
              {isPremium && (
                <p className="text-amber-400 mt-2 text-xs font-mono uppercase tracking-wider">
                  ★ Premium access enabled — all tracks unlocked.
                </p>
              )}
            </>
          )}
        </div>

        {/* ── Bento Panel Grid ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-min max-w-5xl">
          {/* Exam Readiness Ring Card */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-8 flex flex-col items-center justify-center min-h-[240px] row-span-1">
            <CircularProgressRing percentage={78} label="MASTERED" />
          </div>

          {/* License Track Grid — three selector cards */}

          {/* Basic Commercial — always unlocked */}
          <div>
            <LicenseTrackCard
              title="BASIC COMMERCIAL"
              description="Fireworks displays, aerial shells, and ground-based commercial pyrotechnics. 5 questions available."
              href="/dashboard/exam"
              isPremium={isPremium}
            />
          </div>

          {/* Special Effects — locked by default; unlocked if premium */}
          <div>
            <LicenseTrackCard
              title="SPECIAL EFFECTS"
              description="Indoor pyrotechnics, flash powders, and close-proximity effects for film and live events."
              locked
              href="/dashboard/exam"
              isPremium={isPremium}
            />
          </div>

          {/* Theatrical Effect — locked by default; unlocked if premium */}
          <div>
            <LicenseTrackCard
              title="THEATRICAL EFFECT"
              description="Stage pyrotechnics, flash pots, and theatrical special effects for performing arts venues."
              locked
              href="/dashboard/exam"
              isPremium={isPremium}
            />
          </div>
        </div>
      </div>
    </div>
  );
}