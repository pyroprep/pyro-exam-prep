"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CertificatePage() {
  const [pct, setPct] = useState<number | null>(null);
  const [studentName, setStudentName] = useState("Candidate");

  useEffect(() => {
    try {
      let raw = sessionStorage.getItem("quizResults");
      if (!raw) raw = localStorage.getItem("pyroprep_last_results");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed?.totalQuestions > 0) {
        const score = Math.round((parsed.totalCorrect / parsed.totalQuestions) * 100);
        setPct(score);
      }
    } catch {
      // ignore
    }
  }, []);

  if (pct === null) {
    return (
      <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <p className="text-zinc-400 text-sm font-mono mb-4">
            No exam results found. Complete a 100-question mock exam to generate your certificate.
          </p>
          <Link
            href="/quiz?mode=exam"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-semibold uppercase tracking-wider text-sm px-6 py-3 transition-all shadow-[0_0_20px_rgba(234,88,12,0.25)]"
          >
            Take Mock Exam
          </Link>
        </div>
      </main>
    );
  }

  const passed = pct >= 70;
  const eligible = pct >= 80;

  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 sm:p-10">
          <div className="text-center mb-8">
            <p className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">
              Exam Readiness Certificate
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 uppercase tracking-tight">
              Pyro Prep Academy
            </h1>
          </div>

          <div className="border border-zinc-800 rounded-xl bg-zinc-900/60 p-6 sm:p-8">
            <div className="flex flex-col items-center gap-4">
              <div className="text-5xl">{eligible ? "🏅" : passed ? "🎓" : "📋"}</div>
              <p className="text-sm text-zinc-400 font-mono uppercase tracking-wider">
                This certifies that
              </p>
              <p className="text-xl sm:text-2xl font-bold text-zinc-100">{studentName}</p>
              <p className="text-sm text-zinc-400 font-mono uppercase tracking-wider">
                has successfully demonstrated readiness for the California Class B Pyrotechnic Operator exam
              </p>

              <div className="mt-6 w-full">
                <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-left">
                      <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                        Exam Score
                      </p>
                      <p className={`text-3xl font-bold ${eligible ? "text-amber-400" : "text-orange-400"}`}>
                        {pct}%
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                        Status
                      </p>
                      <p className={`text-sm font-semibold uppercase tracking-wider ${eligible ? "text-emerald-400" : passed ? "text-amber-400" : "text-red-400"}`}>
                        {eligible ? "High Achievement" : passed ? "Passed" : "Review Recommended"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-zinc-700 bg-zinc-900/60 hover:border-zinc-600 hover:bg-zinc-900 text-zinc-200 font-semibold uppercase tracking-wider text-sm px-6 py-3 transition-all"
            >
              🖨️ Print Certificate
            </button>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-semibold uppercase tracking-wider text-sm px-6 py-3 transition-all shadow-[0_0_20px_rgba(234,88,12,0.25)]"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}