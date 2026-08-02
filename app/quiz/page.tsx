"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { createSupabaseClient } from "@/lib/supabase";
import {
  type QuizQuestion,
  type SupabaseQuestion,
  toQuizQuestion,
  MODULE_NAMES,
  type ModuleName,
} from "@/lib/quiz-types";

// ─── Helper: convert ALL-CAPS text to Sentence case ─────────────────────────
const formatSentenceCase = (text: string) => {
  if (!text) return '';
  // If string is ALL CAPS, convert to proper Sentence case
  if (text === text.toUpperCase()) {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }
  return text;
};

// ─── Countdown Timer ──────────────────────────────────────────────────────────
function CountdownTimer({
  secondsLeft,
  total,
}: {
  secondsLeft: number;
  total: number;
}) {
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const isUrgent = secondsLeft <= 300; // warn at 5 minutes
  const pct = Math.max(0, (secondsLeft / total) * 100);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 font-mono text-xs uppercase tracking-widest text-zinc-500">
        <span>Time Remaining</span>
        <span
          className={isUrgent ? "text-red-500 animate-pulse" : "text-zinc-400"}
        >
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </span>
      </div>
      <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-linear ${
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
function ProgressIndicator({
  current,
  total,
  label,
}: {
  current: number;
  total: number;
  label?: string;
}) {
  return (
    <div className="flex items-center gap-2 font-mono text-xs text-zinc-400 uppercase tracking-wider">
      {label && <span className="text-zinc-400">{label}</span>}
      <span className="text-orange-500">
        {String(current + 1).padStart(2, "0")}
      </span>
      <span>/</span>
      <span>{String(total).padStart(2, "0")}</span>
    </div>
  );
}

// ─── Loading Skeleton ────────────────────────────────────────────────────────
function QuizSkeleton() {
  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-6 h-6 rounded-full border-2 border-zinc-700 border-t-orange-500 animate-spin" />
        <p className="text-xs text-zinc-600 font-mono uppercase tracking-widest">
          Loading questions...
        </p>
      </div>
    </main>
  );
}

// ─── Module Selector (Study Mode) ────────────────────────────────────────────
function ModuleSelector({
  onSelect,
}: {
  onSelect: (module: ModuleName) => void;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="max-w-xl w-full">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 uppercase tracking-tight text-center mb-2">
          Practice by Module
        </h1>
        <p className="text-zinc-500 text-sm font-mono uppercase tracking-wider text-center mb-8">
          Select a module to begin a 25-question study session.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MODULE_NAMES.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => onSelect(name)}
              className="rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-orange-500/50 hover:bg-zinc-900/60 text-zinc-200 text-sm font-semibold uppercase tracking-wider px-6 py-5 transition-all text-left"
            >
              {name}
            </button>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link
            href="/dashboard"
            className="text-xs text-zinc-500 hover:text-zinc-300 underline underline-offset-2 font-mono uppercase tracking-wider transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Quiz State Machine ──────────────────────────────────────────────────────
type QuizPhase = "loading" | "select-module" | "active" | "finished";

interface AnswerRecord {
  questionIndex: number;
  selectedIndex: number;
  isCorrect: boolean;
}

function QuizContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") as "study" | "exam" | null;

  const [phase, setPhase] = useState<QuizPhase>("loading");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [timeLeft, setTimeLeft] = useState(7200); // 2 hours = 7200s
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isUrgent, setIsUrgent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isExam = mode === "exam";
  const isStudy = mode === "study";
  const TOTAL_TIME = 7200;

  // ── Redirect if unauthenticated ──────────────────────────────────────
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/quiz");
    }
  }, [authLoading, user, router]);

  // ── Fetch module questions for study mode ────────────────────────────
  const fetchStudyQuestions = useCallback(async (module: ModuleName) => {
    setPhase("loading");
    setError(null);
    try {
      const supabase = createSupabaseClient();
      const { data, error: sbError } = await supabase
        .from("questions")
        .select("*")
        .eq("module_name", module)
        .limit(25);

      if (sbError) throw new Error(sbError.message);
      if (!data || data.length === 0) {
        setError(`No questions found for "${module}".`);
        setPhase("select-module");
        return;
      }

      const rows = data as SupabaseQuestion[];
      // Shuffle the 25 questions
      const shuffled = [...rows].sort(() => Math.random() - 0.5);
      setQuestions(shuffled.map(toQuizQuestion));
      setCurrentIndex(0);
      setAnswers([]);
      setPhase("active");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load questions.",
      );
      setPhase("select-module");
    }
  }, []);

  // ── Fetch 100 randomized questions for exam mode ─────────────────────
  const fetchExamQuestions = useCallback(async () => {
    setPhase("loading");
    setError(null);
    try {
      const supabase = createSupabaseClient();

      // Fetch 25 from each module for a balanced 100-question exam
      const allQuestions: SupabaseQuestion[] = [];
      for (const module of MODULE_NAMES) {
        const { data, error: sbError } = await supabase
          .from("questions")
          .select("*")
          .eq("module_name", module)
          .limit(25);

        if (sbError) throw new Error(sbError.message);
        if (data) {
          allQuestions.push(...(data as SupabaseQuestion[]));
        }
      }

      if (allQuestions.length === 0) {
        setError("No questions available. Please check the question bank.");
        return;
      }

      // Shuffle all questions
      const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
      setQuestions(shuffled.map(toQuizQuestion));
      setCurrentIndex(0);
      setAnswers([]);
      setTimeLeft(TOTAL_TIME);
      setPhase("active");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load exam questions.",
      );
    }
  }, []);

  // ── Determine initial phase on mount ─────────────────────────────────
  useEffect(() => {
    if (authLoading || !user) return;

    if (!mode) {
      router.push("/dashboard");
      return;
    }

    if (isStudy) {
      setPhase("select-module");
    } else if (isExam) {
      fetchExamQuestions();
    }
  }, [authLoading, user, mode, isStudy, isExam, fetchExamQuestions, router]);

  // ── Exam timer ───────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "active" || !isExam) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up — finish the exam
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, isExam]);

  // Track urgency for visual feedback
  useEffect(() => {
    if (timeLeft <= 300) setIsUrgent(true);
  }, [timeLeft]);

  const currentQuestion = questions[currentIndex];

  // ── Handle choice selection ──────────────────────────────────────────
  const handleSelect = useCallback(
    (index: number) => {
      if (isSubmitted || phase !== "active") return;
      setSelectedChoice(index);
    },
    [isSubmitted, phase],
  );

  // ── Submit answer ────────────────────────────────────────────────────
  const handleSubmit = useCallback(() => {
    if (selectedChoice === null || !currentQuestion) return;

    const isCorrect = selectedChoice === currentQuestion.correctIndex;
    setAnswers((prev) => [
      ...prev,
      { questionIndex: currentIndex, selectedIndex: selectedChoice, isCorrect },
    ]);
    setIsSubmitted(true);
  }, [selectedChoice, currentQuestion, currentIndex]);

  // ── Next question ────────────────────────────────────────────────────
  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedChoice(null);
      setIsSubmitted(false);
    } else {
      // Finish quiz
      setPhase("finished");
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [currentIndex, questions.length]);

  // ── Finish and navigate to results ───────────────────────────────────
  const handleFinish = useCallback(() => {
    setPhase("finished");
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  // ── Save progress to localStorage and go to results ──────────────────
  const navigateToResults = useCallback(() => {
    // Serialize results for the results page
    const resultsPayload = {
      answers,
      questions,
      totalQuestions: questions.length,
      totalCorrect: answers.filter((a) => a.isCorrect).length,
      mode: mode ?? "study",
      moduleStats: {} as Record<string, { score: number; total: number }>,
    };

    // Calculate per-module stats
    for (const ans of answers) {
      const q = questions[ans.questionIndex];
      if (!q) continue;
      if (!resultsPayload.moduleStats[q.moduleName]) {
        resultsPayload.moduleStats[q.moduleName] = { score: 0, total: 0 };
      }
      resultsPayload.moduleStats[q.moduleName].total++;
      if (ans.isCorrect) {
        resultsPayload.moduleStats[q.moduleName].score++;
      }
    }

    // Persist progress for dashboard
    try {
      const stored = localStorage.getItem("pyroprep_progress");
      const progress = stored
        ? (JSON.parse(stored) as {
            totalCorrect: number;
            moduleStats: Record<string, { score: number; total: number }>;
          })
        : { totalCorrect: 0, moduleStats: {} };

      const correctCount = answers.filter((a) => a.isCorrect).length;
      progress.totalCorrect += correctCount;

      for (const ans of answers) {
        const q = questions[ans.questionIndex];
        if (!q) continue;
        if (!progress.moduleStats[q.moduleName]) {
          progress.moduleStats[q.moduleName] = { score: 0, total: 0 };
        }
        progress.moduleStats[q.moduleName].total++;
        if (ans.isCorrect) {
          progress.moduleStats[q.moduleName].score++;
        }
      }

      localStorage.setItem("pyroprep_progress", JSON.stringify(progress));
    } catch {
      // ignore storage errors
    }

    // Store results in sessionStorage for the results page
    sessionStorage.setItem("quizResults", JSON.stringify(resultsPayload));

    router.push("/results");
  }, [answers, questions, mode, router]);

  // ── Render: Auth loading ─────────────────────────────────────────────
  if (authLoading || !user) {
    return (
      <main className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-6 h-6 rounded-full border-2 border-zinc-700 border-t-orange-500 animate-spin" />
          <p className="text-xs text-zinc-600 font-mono uppercase tracking-widest">
            Authenticating...
          </p>
        </div>
      </main>
    );
  }

  // ── Render: Loading questions ────────────────────────────────────────
  if (phase === "loading") {
    return <QuizSkeleton />;
  }

  // ── Render: Error ────────────────────────────────────────────────────
  if (error && phase !== "select-module") {
    return (
      <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <p className="text-red-400 text-sm font-mono mb-4">{error}</p>
          <Link
            href="/dashboard"
            className="text-xs text-zinc-400 hover:text-zinc-200 underline underline-offset-2 font-mono uppercase tracking-wider transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  // ── Render: Module selector ──────────────────────────────────────────
  if (phase === "select-module") {
    return <ModuleSelector onSelect={fetchStudyQuestions} />;
  }

  // ── Render: Results redirect ─────────────────────────────────────────
  if (phase === "finished") {
    const correctCount = answers.filter((a) => a.isCorrect).length;
    const pct =
      questions.length > 0
        ? Math.round((correctCount / questions.length) * 100)
        : 0;
    const passed = pct >= 70;

    return (
      <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 uppercase tracking-tight mb-4">
            {isExam ? "Exam Complete" : "Session Complete"}
          </h1>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-8 mb-6">
            <p className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              {pct}%
            </p>
            <p className="text-sm font-mono text-zinc-500 uppercase tracking-wider mt-2">
              {correctCount} / {questions.length} correct
            </p>
            {isExam && (
              <p
                className={`text-sm font-mono uppercase tracking-wider mt-3 ${
                  passed ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {passed ? "✓ Passed (70%+)" : "✗ Needs Review (Below 70%)"}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={navigateToResults}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-semibold uppercase tracking-wider text-sm px-8 py-3 transition-all shadow-[0_0_20px_rgba(234,88,12,0.25)]"
          >
            View Detailed Results
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </main>
    );
  }

  // ── Render: Active quiz ──────────────────────────────────────────────
  if (!currentQuestion) {
    return <QuizSkeleton />;
  }

  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Top bar */}
      <div className="border-b border-zinc-800">
        <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/dashboard"
              className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors font-mono uppercase tracking-wider"
            >
              &larr; <span className="text-zinc-300">{isExam ? "Exit Exam" : "Exit Practice"}</span>
            </Link>
            <ProgressIndicator
              current={currentIndex}
              total={questions.length}
              label={
                isExam
                  ? "Question"
                  : currentQuestion.moduleName.split(" ").slice(-1)[0]
              }
            />
          </div>
          {isExam && <CountdownTimer secondsLeft={timeLeft} total={TOTAL_TIME} />}
        </div>
      </div>

      {/* Question area */}
      <div className="flex-1 flex flex-col px-4 sm:px-6 pt-8 pb-12 max-w-3xl mx-auto w-full">
        {/* Module badge (study mode) */}
        {isStudy && (
          <div className="self-start mb-3">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest border border-zinc-800 px-2 py-1 rounded">
              {currentQuestion.moduleName}
            </span>
          </div>
        )}

        {/* Exam mode: mini module label */}
        {isExam && (
          <div className="self-start mb-3">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
              {currentQuestion.moduleName}
            </span>
          </div>
        )}

        {/* Question text */}
        <h2 className="font-bold text-xl text-zinc-100 leading-relaxed mb-8 self-start">
          {formatSentenceCase(currentQuestion.questionText)}
        </h2>

        {/* Choices */}
        <div className="w-full space-y-3 mb-6">
          {currentQuestion.choices.map((choice, index) => {
            const isSelected = selectedChoice === index;
            const isCorrectOption =
              isSubmitted && currentQuestion.correctIndex === index;
            const isWrongSelected =
              isSubmitted && isSelected && currentQuestion.correctIndex !== index;

            let optionClasses =
              "w-full text-left px-4 py-3 border text-sm font-medium transition-all rounded-lg ";

            if (isSubmitted) {
              if (isCorrectOption) {
                optionClasses +=
                  "border-emerald-500 bg-emerald-500/10 text-emerald-300 ";
              } else if (isWrongSelected) {
                optionClasses += "border-red-500 bg-red-500/10 text-red-300 ";
              } else {
                optionClasses += "border-zinc-800 bg-zinc-900/40 text-zinc-600 ";
              }
            } else if (isSelected) {
              optionClasses +=
                "border-orange-500 bg-orange-500/10 text-orange-300 cursor-pointer ";
            } else {
              optionClasses +=
                "border-zinc-800 bg-zinc-900/40 text-zinc-100 hover:border-zinc-700 hover:bg-zinc-800/50 cursor-pointer ";
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
                  <span
                    className={`w-6 h-6 border flex items-center justify-center text-[10px] font-bold flex-shrink-0 rounded ${
                      isSubmitted
                        ? isCorrectOption
                          ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                          : isWrongSelected
                            ? "border-red-500 bg-red-500/20 text-red-400"
                            : "border-zinc-700 text-zinc-600"
                        : isSelected
                          ? "border-orange-500 bg-orange-500/20 text-orange-400"
                          : "border-zinc-700 bg-zinc-800 text-zinc-300"
                    }`}
                  >
                    {isSubmitted
                      ? isCorrectOption
                        ? "✓"
                        : isWrongSelected
                          ? "✗"
                          : String.fromCharCode(65 + index)
                      : String.fromCharCode(65 + index)}
                  </span>
                  {formatSentenceCase(choice)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Submit button (shown until submitted) */}
        {!isSubmitted && (
          <div className="self-start">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={selectedChoice === null}
              className={`px-6 py-2 font-semibold text-sm transition-all uppercase tracking-wider rounded-md ${
                selectedChoice !== null
                  ? "bg-orange-600 hover:bg-orange-500 text-white shadow-[0_0_20px_rgba(234,88,12,0.25)] cursor-pointer"
                  : "bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-800"
              }`}
            >
              Submit Answer
            </button>
          </div>
        )}

        {/* Feedback panel (after submission) */}
        {isSubmitted && (
          <div className="mt-6 border border-zinc-800 bg-zinc-900/50 rounded-xl p-5 animate-slide-up">
            {/* Status banner */}
            <div
              className={`border-l-4 pl-4 mb-4 ${
                selectedChoice === currentQuestion.correctIndex
                  ? "border-emerald-500"
                  : "border-red-500"
              }`}
            >
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
              {/* Show the correct answer if wrong */}
              {selectedChoice !== currentQuestion.correctIndex && (
                <p className="text-xs text-zinc-400 mt-1">
                  Correct answer:{" "}
                  <span className="text-emerald-400">
                    {String.fromCharCode(65 + currentQuestion.correctIndex)}.{" "}
                    {formatSentenceCase(currentQuestion.choices[currentQuestion.correctIndex])}
                  </span>
                </p>
              )}
            </div>

            {/* Explanation (shown in study mode immediately; always available after submit) */}
            <p className="text-sm text-zinc-300 leading-relaxed mb-4">
              {formatSentenceCase(currentQuestion.explanation)}
            </p>

            {currentIndex < questions.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold transition-colors rounded-md shadow-[0_0_20px_rgba(234,88,12,0.25)] cursor-pointer"
              >
                Next Question
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="px-6 py-2 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white text-sm font-semibold transition-colors rounded-md shadow-[0_0_20px_rgba(234,88,12,0.25)] cursor-pointer"
              >
                Finish & See Results
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

// ─── Exported page with Suspense boundary ─────────────────────────────────────
export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-zinc-950 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-6 h-6 rounded-full border-2 border-zinc-700 border-t-orange-500 animate-spin" />
            <p className="text-xs text-zinc-600 font-mono uppercase tracking-widest">
              Loading...
            </p>
          </div>
        </main>
      }
    >
      <QuizContent />
    </Suspense>
  );
}