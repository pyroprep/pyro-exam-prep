"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { createSupabaseClient } from "@/lib/supabase";
import {
  MODULE_NAMES,
  type SupabaseQuestion,
} from "@/lib/quiz-types";
import VideoPlayer from "@/components/VideoPlayer";
import TutorChat from "@/components/TutorChat";

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
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
      <p className="text-xs text-zinc-400 font-mono uppercase tracking-widest text-center">
        {label}
      </p>
    </div>
  );
}

// ─── Module Score Badge ───────────────────────────────────────────────────────
function ModuleScoreBadge({
  name,
  score,
  total,
}: {
  name: string;
  score: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const barColor =
    pct >= 70 ? "bg-emerald-500" : pct >= 40 ? "bg-amber-500" : "bg-red-500";

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
          {name}
        </h4>
        <span className="text-xs font-mono text-zinc-500 tabular-nums">
          {score}/{total}
        </span>
      </div>
      <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
        {pct}% mastery
      </p>
    </div>
  );
}

// ─── Summary Card ────────────────────────────────────────────────────────────
function SummaryCard({
  label,
  value,
  accent = "amber",
}: {
  label: string;
  value: string;
  accent?: "amber" | "emerald";
}) {
  const accentClass =
    accent === "emerald" ? "text-emerald-400" : "text-amber-400";
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
      <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
        {label}
      </p>
      <p className={`mt-2 text-2xl font-bold tabular-nums ${accentClass}`}>
        {value}
      </p>
    </div>
  );
}

// ─── Dashboard Page ──────────────────────────────────────────────────────────
interface ModuleStats {
  score: number;
  total: number;
}

export default function DashboardPage() {
  const { profile, loading: authLoading, user } = useAuth();
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalAttempted, setTotalAttempted] = useState(0);
  const [moduleStats, setModuleStats] = useState<Record<string, ModuleStats>>(
    {},
  );
  const [dataLoading, setDataLoading] = useState(true);

  const isPremium = profile?.is_premium ?? false;

  // Fetch aggregate stats from Supabase on mount
  useEffect(() => {
    if (authLoading || !user) return;

    async function fetchStats() {
      const supabase = createSupabaseClient();

      const { data, error } = await supabase
        .from("questions")
        .select("module_name");

      if (error || !data) {
        setDataLoading(false);
        return;
      }

      const questions = data as Pick<SupabaseQuestion, "module_name">[];

      // Count total questions
      setTotalQuestions(questions.length);

      // Count per module
      const stats: Record<string, ModuleStats> = {};
      for (const m of MODULE_NAMES) {
        const count = questions.filter((q) => q.module_name === m).length;
        stats[m] = { score: 0, total: count };
      }
      setModuleStats(stats);
      setDataLoading(false);
    }

    fetchStats();
  }, [authLoading, user]);

  // Attempt to load progress from localStorage
  useEffect(() => {
    if (dataLoading) return;
    try {
      const stored = localStorage.getItem("pyroprep_progress");
      if (stored) {
        const parsed = JSON.parse(stored) as {
          totalCorrect: number;
          totalAttempted: number;
          moduleStats: Record<string, ModuleStats>;
        };
        // synchronize persisted progress with state on mount
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTotalCorrect(parsed.totalCorrect ?? 0);
        setTotalAttempted(parsed.totalAttempted ?? 0);
        setModuleStats((prev) => ({
          ...prev,
          ...parsed.moduleStats,
        }));
      }
    } catch {
      // ignore parse errors
    }
  }, [dataLoading]);

  const masteryPct =
    totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

  // If auth is still loading, show skeleton
  if (authLoading) {
    return (
      <main className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-6 h-6 rounded-full border-2 border-zinc-700 border-t-orange-500 animate-spin" />
          <p className="text-xs text-zinc-600 font-mono uppercase tracking-widest">
            Loading dashboard...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header greeting */}
        <div className="mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
            Welcome{user?.email ? `, ${user.email.split("@")[0]}` : " Back"}
          </h1>
          <p className="text-zinc-500 mt-1 text-sm font-mono uppercase tracking-wider">
            Your Pyrotechnic Operator exam command centre.
          </p>
          {isPremium && (
            <p className="text-amber-400 mt-2 text-xs font-mono uppercase tracking-wider">
              ★ Premium access enabled — all tracks unlocked.
            </p>
          )}
        </div>

        {/* ── Orientation Video ─────────────────────────────────────── */}
        <div className="mb-10">
          <VideoPlayer
            src="/videos/video_1.mp4"
            title="Orientation"
          />
        </div>

        {/* ── Summary Cards ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <SummaryCard
            label="Overall Mastery"
            value={`${Math.round(masteryPct)}%`}
            accent={masteryPct >= 70 ? "emerald" : "amber"}
          />
          <SummaryCard
            label="Questions Answered"
            value={String(totalAttempted)}
            accent="amber"
          />
          <SummaryCard
            label="Access"
            value={isPremium ? "Active" : "Basic"}
            accent={isPremium ? "emerald" : "amber"}
          />
        </div>

        {/* ── Module Progress Grid ──────────────────────────────────── */}
        <div className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-200 mb-4">
            Module Progress
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MODULE_NAMES.map((name) => {
              const stats = moduleStats[name] ?? { score: 0, total: 0 };
              return (
                <ModuleScoreBadge
                  key={name}
                  name={name}
                  score={stats.score}
                  total={stats.total}
                />
              );
            })}
          </div>
        </div>

        {/* ── Mastery Ring (visual) ─────────────────────────────────── */}
        <div className="flex justify-center mb-10">
          <CircularProgressRing
            percentage={masteryPct}
            label="OVERALL MASTERY"
            size={140}
          />
        </div>

        {/* ── Action Buttons ────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/quiz?mode=study"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-zinc-700 bg-zinc-900/60 hover:border-zinc-600 hover:bg-zinc-900 text-zinc-200 font-semibold uppercase tracking-wider text-sm px-8 py-4 transition-all"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            Practice by Module
          </Link>
          <Link
            href="/quiz?mode=exam"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-semibold uppercase tracking-wider text-sm px-8 py-4 transition-all shadow-[0_0_20px_rgba(234,88,12,0.25)]"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Take 100-Question Mock Exam
          </Link>
        </div>
      </div>
      <TutorChat />
    </main>
  );
}
