"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import type { QuizQuestion } from "@/lib/quiz-types";

interface AnswerRecord {
  questionIndex: number;
  selectedIndex: number;
  isCorrect: boolean;
}

interface ResultsPayload {
  answers: AnswerRecord[];
  questions: QuizQuestion[];
  totalQuestions: number;
  totalCorrect: number;
  mode: "study" | "exam";
  moduleStats: Record<string, { score: number; total: number }>;
}

// ─── Module Score Bar ─────────────────────────────────────────────────────────
function ModuleScoreBar({
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
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
          {name}
        </span>
        <span className="text-xs font-mono tabular-nums text-zinc-500">
          {score}/{total} ({pct}%)
        </span>
      </div>
      <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Missed Question Accordion Item ───────────────────────────────────────────
function MissedQuestionCard({
  question,
  userAnswerIndex,
}: {
  question: QuizQuestion;
  userAnswerIndex: number;
}) {
  const [open, setOpen] = useState(false);

  const correctIndex = question.correctIndex;
  const userChoice = question.choices[userAnswerIndex];
  const correctChoice = question.choices[correctIndex];

  return (
    <div className="border border-zinc-800 rounded-xl bg-zinc-900/30 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-left px-5 py-4 flex items-start justify-between gap-4 hover:bg-zinc-900/50 transition-colors"
      >
        <div className="min-w-0 flex-1">
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-1">
            {question.moduleName}
          </p>
          <p className="text-sm text-zinc-200 leading-relaxed line-clamp-2">
            {question.questionText}
          </p>
        </div>
        <span className="text-xs font-mono text-red-400 uppercase tracking-wider whitespace-nowrap mt-0.5">
          ✗ Missed
        </span>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-zinc-800 pt-4 space-y-4">
          {/* User's wrong answer */}
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1">
              Your Answer
            </p>
            <p className="text-sm text-red-400">
              {String.fromCharCode(65 + userAnswerIndex)}. {userChoice}
            </p>
          </div>

          {/* Correct answer */}
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1">
              Correct Answer
            </p>
            <p className="text-sm text-emerald-400">
              {String.fromCharCode(65 + correctIndex)}. {correctChoice}
            </p>
          </div>

          {/* Title 19 explanation */}
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-amber-400 mb-1">
              Title 19 Explanation
            </p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {question.explanation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Results Page ─────────────────────────────────────────────────────────────
export default function ResultsPage() {
  const { user, loading: authLoading } = useAuth();

  const { results, error } = useMemo(() => {
    if (authLoading || !user) return { results: null, error: null };
    try {
      const raw = sessionStorage.getItem("quizResults");
      if (!raw) {
        return { results: null, error: "No quiz results found. Take a quiz first." };
      }
      const parsed = JSON.parse(raw) as ResultsPayload;
      if (
        !parsed.questions ||
        !parsed.answers ||
        parsed.questions.length === 0
      ) {
        return { results: null, error: "No quiz results found. Take a quiz first." };
      }
      return { results: parsed, error: null };
    } catch {
      return { results: null, error: "Failed to load quiz results." };
    }
  }, [authLoading, user]);

  // ── Auth guard ───────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <main className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-6 h-6 rounded-full border-2 border-zinc-700 border-t-orange-500 animate-spin" />
          <p className="text-xs text-zinc-600 font-mono uppercase tracking-widest">
            Loading results...
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-zinc-400 text-sm font-mono mb-4">
            Please sign in to view your results.
          </p>
          <Link
            href="/login"
            className="text-xs text-orange-400 hover:text-orange-300 underline underline-offset-2 font-mono uppercase tracking-wider transition-colors"
          >
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  // ── Error / no results ───────────────────────────────────────────────
  if (error || !results) {
    return (
      <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-8 mb-6">
            <p className="text-4xl mb-4">📋</p>
            <p className="text-zinc-400 text-sm font-mono mb-4">
              {error ?? "No results available."}
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-semibold uppercase tracking-wider text-sm px-8 py-3 transition-all shadow-[0_0_20px_rgba(234,88,12,0.25)]"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const { answers, questions, totalCorrect, mode, moduleStats } = results;
  const totalQuestions = questions.length;
  const pct =
    totalQuestions > 0
      ? Math.round((totalCorrect / totalQuestions) * 100)
      : 0;
  const passed = pct >= 70;
  const isExam = mode === "exam";

  // Identify missed questions
  const missed = answers
    .filter((a) => !a.isCorrect)
    .map((a) => ({
      answer: a,
      question: questions[a.questionIndex],
    }))
    .filter((m) => m.question); // safety filter

  return (
    <main className="min-h-screen bg-zinc-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 uppercase tracking-tight">
            {isExam ? "Exam Results" : "Practice Results"}
          </h1>
          <p className="text-zinc-500 mt-1 text-sm font-mono uppercase tracking-wider">
            Detailed performance breakdown
          </p>
        </div>

        {/* Score card */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
            {/* Score ring */}
            <div className="relative w-36 h-36">
              <svg
                width={144}
                height={144}
                className="-rotate-90"
                viewBox="0 0 144 144"
              >
                <circle
                  cx={72}
                  cy={72}
                  r={58}
                  fill="none"
                  stroke="oklch(0.269 0 0)"
                  strokeWidth={12}
                />
                <circle
                  cx={72}
                  cy={72}
                  r={58}
                  fill="none"
                  stroke={
                    passed
                      ? "oklch(0.596 0.164 156.7)"
                      : "oklch(0.627 0.194 38.4)"
                  }
                  strokeWidth={12}
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 58}
                  strokeDashoffset={
                    2 * Math.PI * 58 - (pct / 100) * 2 * Math.PI * 58
                  }
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className={`text-3xl font-bold ${
                    passed ? "text-emerald-400" : "text-orange-400"
                  }`}
                >
                  {pct}%
                </span>
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <p
                className={`text-lg font-semibold uppercase tracking-wider ${
                  passed ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {passed
                  ? "Passed — 70%+ achieved"
                  : "Needs Review — below 70%"}
              </p>
              <p className="text-sm font-mono text-zinc-500 mt-1">
                {totalCorrect} correct out of {totalQuestions} questions
              </p>
              <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mt-2">
                {isExam
                  ? "CA OSFM passing threshold: 70%"
                  : "Study session — no pass/fail"}
              </p>
            </div>
          </div>
        </div>

        {/* Module breakdown */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-200 mb-4">
            Score by Module
          </h2>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-5">
            {Object.entries(moduleStats).map(([name, stats]) => (
              <ModuleScoreBar
                key={name}
                name={name}
                score={stats.score}
                total={stats.total}
              />
            ))}
            {Object.keys(moduleStats).length === 0 && (
              <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider">
                No module data available.
              </p>
            )}
          </div>
        </div>

        {/* Missed questions accordion */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-200 mb-4">
            Review Missed Questions ({missed.length})
          </h2>
          {missed.length === 0 ? (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
              <p className="text-sm text-emerald-400 font-mono uppercase tracking-wider">
                Perfect score! No missed questions.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {missed.map(({ question, answer }) => (
                <MissedQuestionCard
                  key={`${question.id}-${answer.questionIndex}`}
                  question={question}
                  userAnswerIndex={answer.selectedIndex}
                />
              ))}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-zinc-700 bg-zinc-900/60 hover:border-zinc-600 hover:bg-zinc-900 text-zinc-200 font-semibold uppercase tracking-wider text-sm px-8 py-3 transition-all"
          >
            ← Dashboard
          </Link>
          <Link
            href={isExam ? "/quiz?mode=exam" : "/quiz?mode=study"}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-semibold uppercase tracking-wider text-sm px-8 py-3 transition-all shadow-[0_0_20px_rgba(234,88,12,0.25)]"
          >
            {isExam ? "Retake Exam" : "Practice Again"}
          </Link>
        </div>
      </div>
    </main>
  );
}