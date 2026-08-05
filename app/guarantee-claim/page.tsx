"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function GuaranteeClaimPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [examDate, setExamDate] = useState("");
  const [examScore, setExamScore] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/guarantee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examDate,
          examScore: Number(examScore),
          details,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to submit guarantee claim.");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading) {
    return (
      <main className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-6 h-6 rounded-full border-2 border-zinc-700 border-t-orange-500 animate-spin" />
          <p className="text-xs text-zinc-400 font-mono uppercase tracking-widest">
            Loading...
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <p className="text-zinc-400 text-sm font-mono mb-4">
            Please sign in to submit a Pass Guarantee claim.
          </p>
          <Link
            href="/login?redirect=/guarantee-claim"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-semibold uppercase tracking-wider text-sm px-6 py-3 transition-all shadow-[0_0_20px_rgba(234,88,12,0.25)]"
          >
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-8 mb-6">
            <p className="text-4xl mb-4">✅</p>
            <h1 className="text-xl font-bold text-zinc-100 mb-2">
              Claim Submitted
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Your Pass Guarantee claim has been received. Our team will review
              your submission and contact you within 2–3 business days to
              process your refund.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-zinc-700 bg-zinc-900/60 hover:border-zinc-600 hover:bg-zinc-900 text-zinc-200 font-semibold uppercase tracking-wider text-sm px-6 py-3 transition-all"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 uppercase tracking-tight mb-2">
          Pass Guarantee Claim
        </h1>
        <p className="text-sm text-zinc-400 mb-8">
          If you completed the full course and did not pass your California
          OSFM Class B Pyrotechnic Operator exam, you may be eligible for a
          full refund under our 100% Pass Guarantee.
        </p>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-300 mb-3">
            Eligibility Requirements
          </h2>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li>• Completed all 4 study modules and the 100-question mock exam</li>
            <li>• Attempted the official OSFM Class B exam within 12 months of purchase</li>
            <li>• Scored below the 70% passing threshold on the official exam</li>
            <li>• Claim submitted within 30 days of your exam date</li>
          </ul>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-5"
        >
          <div>
            <label
              htmlFor="examDate"
              className="block text-[11px] font-mono uppercase tracking-widest text-zinc-300 mb-1.5"
            >
              Official Exam Date
            </label>
            <input
              id="examDate"
              type="date"
              required
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-black px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/50 transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="examScore"
              className="block text-[11px] font-mono uppercase tracking-widest text-zinc-300 mb-1.5"
            >
              Your Exam Score (%)
            </label>
            <input
              id="examScore"
              type="number"
              required
              min="0"
              max="100"
              value={examScore}
              onChange={(e) => setExamScore(e.target.value)}
              placeholder="e.g., 65"
              className="w-full rounded-lg border border-zinc-800 bg-black px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/50 transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="details"
              className="block text-[11px] font-mono uppercase tracking-widest text-zinc-300 mb-1.5"
            >
              Additional Details (optional)
            </label>
            <textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
              placeholder="Provide any additional context about your exam experience..."
              className="w-full rounded-lg border border-zinc-800 bg-black px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/50 transition-colors"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 font-mono">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold uppercase tracking-wider py-3 transition-all shadow-[0_0_20px_rgba(234,88,12,0.25)]"
          >
            {submitting ? "Submitting..." : "Submit Claim"}
          </button>
        </form>
      </div>
    </main>
  );
}