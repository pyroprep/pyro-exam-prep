"use client";

import Link from "next/link";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@/lib/auth-context";

const PayPalScriptProvider = dynamic(
  () =>
    import("@paypal/react-paypal-js").then((mod) => mod.PayPalScriptProvider),
  {
    ssr: false,
    loading: () => (
      <div className="w-full rounded-2xl border border-white/10 bg-zinc-900/60 py-4 text-center text-[10px] font-mono uppercase tracking-wider text-zinc-400 backdrop-blur-md">
        Loading secure checkout…
      </div>
    ),
  },
);

const PayPalButtons = dynamic(
  () => import("@paypal/react-paypal-js").then((mod) => mod.PayPalButtons),
  { ssr: false },
);

const PLANS = [
  {
    id: "demo",
    name: "Free Evaluation Demo",
    price: "$0",
    period: "",
    tag: "",
    description:
      "Sample prep experience to test the platform before unlocking full institutional access.",
    features: [
      "10 Title 19 Sample Questions",
      "Course Orientation Video access",
      "Basic score preview",
    ],
    cta: "Try Free Demo",
    ctaHref: "/quiz?demo=true",
    highlighted: false,
  },
  {
    id: "premium",
    name: "Full Academy Course & Exam Prep",
    price: "$249",
    period: "One-Time Payment (Lifetime Access)",
    tag: "Recommended - Pass Guarantee",
    description:
      "Complete institutional prep course for California Class B (1.3G Display) & Class C (1.4G Commercial) Pyrotechnic Operator Licenses.",
    features: [
      "Complete 500+ Title 19 Question Bank (Study Drills & 100-Q Timed Mock Exams)",
      "All 10 Audio-Narrated Video Curriculum Modules",
      'Unlimited 24/7 AI Title 19 Tutor Access ("Pyro AI")',
      "Interactive Table 19-A Fallout Calculator Tool",
      "Downloadable CA Title 19 Exam Readiness Certificate",
      "100% Pass Guarantee (Full refund if you fail your OSFM exam)",
    ],
    cta: "Upgrade Now",
    ctaHref: "",
    highlighted: true,
  },
];

export default function PricingPage() {
  const { user } = useAuth();
  const [success, setSuccess] = useState(false);

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "";

  async function createPayPalOrder(): Promise<string> {
    if (!user) {
      throw new Error("Please sign in first to upgrade.");
    }

    const res = await fetch("/api/paypal/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error ?? "Failed to create PayPal order");
    }

    return data.id;
  }

  async function handleApprove() {
    setSuccess(true);
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 2000);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-950 px-4 py-20 text-zinc-100 lg:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/15 via-zinc-950 to-zinc-950"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.03]"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <Link href="/dashboard" className="inline-flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 shadow-[0_0_18px_rgba(245,158,11,0.45)]" />
            <span className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
              Pyro Prep Academy
            </span>
          </Link>
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            <span className="bg-gradient-to-br from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              Unlock Premium Tracks
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            Choose the plan that fits your exam prep needs.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
          {PLANS.map((plan) => (
            <article
              key={plan.id}
              className={`relative overflow-hidden rounded-2xl border bg-zinc-900/60 p-8 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5 ${
                plan.highlighted ? "border-amber-500/30 ring-1 ring-amber-500/20" : "border-white/10"
              }`}
            >
              {plan.tag && (
                <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.18)]">
                  {plan.tag}
                </span>
              )}

              <div className="flex h-full flex-col gap-6">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-200">
                    {plan.name}
                  </h2>
                  <div className="mt-3">
                    <span className="text-4xl font-bold tracking-tight text-zinc-100 tabular-nums">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="mt-1.5 block text-[10px] font-mono uppercase tracking-wider text-amber-400">
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-3 flex-1">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-zinc-400"
                    >
                      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
                        <svg
                          className="h-3.5 w-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.id === "demo" ? (
                  <Link
                    href={plan.ctaHref || "/quiz?demo=true"}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900/80 px-6 py-3.5 text-sm font-medium text-zinc-200 transition-all duration-200 hover:-translate-y-0.5 hover:bg-zinc-800 hover:text-white active:scale-[0.98]"
                  >
                    {plan.cta}
                  </Link>
                ) : success ? (
                  <div className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-6 py-3.5 text-sm font-semibold text-emerald-300">
                    ✓ Premium Activated!
                  </div>
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-zinc-950/40 p-4">
                    <PayPalScriptProvider
                      options={{ clientId, intent: "capture" }}
                    >
                      <PayPalButtons
                        style={{
                          layout: "vertical",
                          color: "gold",
                          shape: "rect",
                          label: "pay",
                        }}
                        createOrder={createPayPalOrder}
                        onApprove={handleApprove}
                        onError={(err) => {
                          console.error("PayPal Checkout error:", err);
                          alert(
                            "Something went wrong during checkout. Please try again.",
                          );
                        }}
                        onCancel={() => {}}
                      />
                    </PayPalScriptProvider>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-900/80 px-6 py-3.5 text-sm font-medium text-zinc-200 transition-all duration-200 hover:-translate-y-0.5 hover:bg-zinc-800 hover:text-white active:scale-[0.98]"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
