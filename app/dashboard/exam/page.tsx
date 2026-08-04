"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { osfmQuestions, type Question } from "@/lib/questions";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

// ─── Countdown Timer Bar (60:00 = 3600 seconds) ─────────────────────────────
function CountdownTimer({ seconds, total }: { seconds: number; total: number }) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const isUrgent = seconds <= 120;
  const pct = Math.max(0, (seconds / total) * 100);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 font-mono text-xs uppercase tracking-widest text-zinc-500">
        <span>Time Remaining</span>
        <span className={isUrgent ? "text-red-500 animate-pulse" : "text-zinc-400"}>
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </span>
      </div>
      <div className="w-full h-px bg-zinc-800 overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${
            isUrgent
              ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]"
              : "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Progress Indicator ──────────────────────────────────────────────────────
function ProgressIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 font-mono text-xs text-zinc-500 uppercase tracking-wider">
      <span className="text-orange-500">{String(current + 1).padStart(2, "0")}</span>
      <span>/</span>
      <span>{String(total).padStart(2, "0")}</span>
    </div>
  );
}

// ─── Results Breakdown Interface ─────────────────────────────────────────────
function ResultsView({
  history,
  questions,
}: {
  history: boolean[];
  questions: Question[];
}) {
  const total = questions.length;
  const score = history.filter(Boolean).length;
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4 sm:p-6 animate-fade-in-up">
      <div className="max-w-2xl w-full">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-tight text-center mb-8">
          Examination Performance Summary
        </h1>

        {/* Score Card */}
        <div className="border border-zinc-800 bg-zinc-900/40 p-8 sm:p-10 text-center mb-8">
          <span className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            {pct}%
          </span>
          <p className="text-sm font-mono text-zinc-500 uppercase tracking-wider mt-3">
            Score: {score} / {total} Correct ({pct}%)
          </p>
          <div className="w-full h-px bg-zinc-800 overflow-hidden mt-4">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Administrative Data Table */}
        <div className="border border-zinc-800 bg-zinc-900/40 overflow-hidden mb-8">
          <div className="px-5 py-3 border-b border-zinc-800">
            <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
              Question Breakdown
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                    #
                  </th>
                  <th className="px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                    Status
                  </th>
                  <th className="px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                    Title 19 Code
                  </th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q, i) => {
                  const passed = history[i];
                  return (
                    <tr
                      key={q.id}
                      className="border-b border-zinc-800/60 last:border-b-0"
                    >
                      <td className="px-5 py-3 font-mono text-xs text-zinc-400">
                        {String(i + 1).padStart(2, "0")}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`text-xs font-mono uppercase tracking-wider ${
                            passed ? "text-emerald-500" : "text-red-500"
                          }`}
                        >
                          {passed ? "PASS" : "FAIL"}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-mono text-xs text-amber-400">
                        {q.sectionCode}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Return Button */}
        <div className="flex justify-center">
          <Link
            href="/dashboard"
            className="inline-block px-8 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-semibold text-sm transition-colors shadow-[0_0_20px_rgba(234,88,12,0.25)]"
          >
            Return to Exam Desk
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Immersive Focus Exam Mode ───────────────────────────────────────────────
export default function ExamPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // ── All hooks must be called unconditionally (before any early return) ──
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [history, setHistory] = useState<boolean[]>([]);
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
  const [isExamFinished, setIsExamFinished] = useState(false);
  const TOTAL_TIME = 3600;

  const examQuestions = osfmQuestions;

  // ── Auth guard: redirect unauthenticated users to /login ───────────
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  // Core timer tick — runs every second while exam is active
  useEffect(() => {
    if (isExamFinished) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsExamFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isExamFinished]);

  const currentQuestion = examQuestions[currentIndex];

  // Select a choice — applies orange highlight
  const handleSelect = useCallback(
    (index: number) => {
      if (isSubmitted || isExamFinished || authLoading || !user) return;
      setSelectedChoice(index);
    },
    [isSubmitted, isExamFinished, authLoading, user],
  );

  // Submit the current answer and reveal rationale
  const handleSubmit = useCallback(() => {
    if (selectedChoice === null || !currentQuestion) return;

    const isCorrect = selectedChoice === currentQuestion.correctIndex;
    setHistory((prev) => [...prev, isCorrect]);
    setIsSubmitted(true);
  }, [selectedChoice, currentQuestion]);

  // Advance to next question or finish the exam
  const handleNext = useCallback(() => {
    if (currentIndex < examQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedChoice(null);
      setIsSubmitted(false);
    } else {
      setIsExamFinished(true);
    }
  }, [currentIndex, examQuestions.length]);

  // ── Show loading/authenticating state ──────────────────────────────
  if (authLoading || !user) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-6 h-6 rounded-full border-2 border-zinc-700 border-t-orange-500 animate-spin" />
          <p className="text-xs text-zinc-600 font-mono uppercase tracking-widest">
            Authenticating...
          </p>
        </div>
      </main>
    );
  }

  // ── Exam Finished Screen ───────────────────────────────────────────────
  if (isExamFinished) {
    // Pad history to match question count (in case timer expired)
    const paddedHistory = [...history];
    while (paddedHistory.length < examQuestions.length) {
      paddedHistory.push(false);
    }

    return (
      <ResultsView
        history={paddedHistory}
        questions={examQuestions}
      />
    );
  }

  // ── Active Exam Interface (Full Focus Mode — no sidebar) ──────────────
  return (
    <main className="min-h-screen bg-black flex flex-col">
      {/* Top bar — compact, no sidebar chrome */}
      <h1 className="sr-only">Practice Exam</h1>
      <div className="border-b border-zinc-800">
        <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/dashboard"
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors font-mono uppercase tracking-wider"
            >
              &larr; Exit Exam
            </Link>
            <ProgressIndicator current={currentIndex} total={examQuestions.length} />
          </div>
          <CountdownTimer seconds={timeLeft} total={TOTAL_TIME} />
        </div>
      </div>

      {/* Question Area */}
      <div className="flex-1 flex flex-col px-4 sm:px-6 pt-8 pb-12 max-w-3xl mx-auto w-full">
        {/* Section Code Badge */}
        <div className="self-start mb-4">
          <span className="text-xs font-mono text-amber-400 uppercase tracking-widest border border-zinc-800 px-2 py-1">
            {currentQuestion.sectionCode}
          </span>
        </div>

        {/* Question Text — uppercase, clean */}
        <h2 className="text-base sm:text-lg text-white font-medium leading-relaxed mb-8 self-start">
          {currentQuestion.question}
        </h2>

        {/* Choices — stacked vertically in uniform panels */}
        <div className="w-full space-y-3 mb-6">
          {currentQuestion.choices.map((choice, index) => {
            const isSelected = selectedChoice === index;
            const isCorrectOption =
              isSubmitted && currentQuestion.correctIndex === index;
            const isWrongSelected =
              isSubmitted && isSelected && currentQuestion.correctIndex !== index;

            // Base classes — default bg-zinc-900/40 border-zinc-800
            let optionClasses =
              "w-full text-left px-4 py-3 border text-sm font-medium transition-all ";

            if (isSubmitted) {
              // Revealed state — green border for correct, red for wrong pick
              if (isCorrectOption) {
                optionClasses +=
                  "border-emerald-500 bg-zinc-900/40 text-emerald-300 ";
              } else if (isWrongSelected) {
                optionClasses +=
                  "border-red-500 bg-zinc-900/40 text-red-300 ";
              } else {
                optionClasses +=
                  "border-zinc-800 bg-zinc-900/40 text-zinc-600 ";
              }
            } else if (isSelected) {
              // Intense orange frame on selection
              optionClasses +=
                "border-orange-500 bg-orange-500/10 text-orange-300 cursor-pointer ";
            } else {
              // Default — uniform dark panel, hover lifts
              optionClasses +=
                "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200 cursor-pointer ";
            }

            return (
              <button
                key={index}
                type="button"
                onClick={() => handleSelect(index)}
                disabled={isSubmitted}
                className={optionClasses}
              >
                <span className="flex items-center gap-3">
                  {/* Choice letter / status badge */}
                  <span
                    className={`w-6 h-6 border flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                      isSubmitted
                        ? isCorrectOption
                          ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                          : isWrongSelected
                            ? "border-red-500 bg-red-500/20 text-red-400"
                            : "border-zinc-700 text-zinc-600"
                        : isSelected
                          ? "border-orange-500 bg-orange-500/20 text-orange-400"
                          : "border-zinc-700 text-zinc-600"
                    }`}
                  >
                    {isCorrectOption
                      ? "✓"
                      : isWrongSelected
                        ? "✗"
                        : String.fromCharCode(65 + index)}
                  </span>
                  {choice}
                </span>
              </button>
            );
          })}
        </div>

        {/* SUBMIT ANSWER Button */}
        {!isSubmitted && (
          <div className="self-start">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={selectedChoice === null}
              className={`px-6 py-2 font-semibold text-sm transition-all uppercase tracking-wider ${
                selectedChoice !== null
                  ? "bg-orange-600 hover:bg-orange-500 text-white shadow-[0_0_20px_rgba(234,88,12,0.25)] cursor-pointer"
                  : "bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-800"
              }`}
            >
              Submit Answer
            </button>
          </div>
        )}

        {/* Rationale + NEXT QUESTION card — revealed after SUBMIT ANSWER */}
        {isSubmitted && (
          <div className="mt-6 border border-zinc-800 bg-zinc-900/50 p-5 animate-slide-up">
            {/* Status Banner — green border if correct, red border if incorrect */}
            <div
              className={`border-l-4 pl-4 mb-4 ${
                selectedChoice === currentQuestion.correctIndex
                  ? "border-emerald-500"
                  : "border-red-500"
              }`}
            >
              <div className="flex items-center gap-3 mb-1">
                <span
                  className={`text-xs font-mono uppercase tracking-wider font-semibold ${
                    selectedChoice === currentQuestion.correctIndex
                      ? "text-emerald-500"
                      : "text-red-500"
                  }`}
                >
                  {selectedChoice === currentQuestion.correctIndex
                    ? "✓ Correct"
                    : "✗ Incorrect"}
                </span>
              </div>
              {/* Gold Title 19 reference code */}
              <p className="text-xs font-mono text-amber-400 uppercase tracking-widest mt-1">
                {currentQuestion.sectionCode}
              </p>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed mb-4 uppercase">
              {currentQuestion.rationale}
            </p>
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold transition-colors shadow-[0_0_20px_rgba(234,88,12,0.25)] cursor-pointer"
            >
              Next Question
            </button>
          </div>
        )}
      </div>
    </main>
  );
}