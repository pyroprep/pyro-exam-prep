"use client";

import Link from "next/link";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@/lib/auth-context";

// Code-split the PayPal SDK: it is only needed when the checkout renders,
// so load it client-side on demand instead of in the initial page bundle.
const PayPalScriptProvider = dynamic(
  () =>
    import("@paypal/react-paypal-js").then((mod) => mod.PayPalScriptProvider),
  {
    ssr: false,
    loading: () => (
      <div className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 py-4 text-center text-[10px] font-mono uppercase tracking-wider text-zinc-400">
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
    // Refresh the page so the dashboard picks up the new premium status
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 2000);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-16">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <Link href="/dashboard" className="inline-flex items-center gap-2 mb-4">
            <span className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-xl font-bold text-zinc-100 tracking-tight">
              Pyro Prep Academy
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight mt-4">
            Unlock Premium Tracks
          </h1>
          <p className="text-zinc-400 mt-2 text-sm tracking-wide">
            Choose the plan that fits your exam prep needs.
          </p>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto items-stretch">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-xl border p-8 flex flex-col gap-6 transition-all duration-200 ${
                plan.highlighted
                  ? "border-orange-500/50 bg-zinc-900/60 ring-1 ring-orange-500/20"
                  : "border-zinc-800 bg-zinc-900/40"
              }`}
            >
              {plan.tag && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-[10px] font-bold uppercase tracking-wider text-zinc-950 shadow-[0_0_16px_rgba(234,88,12,0.35)]">
                  {plan.tag}
                </span>
              )}

              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-200">
                  {plan.name}
                </h2>
                <div className="mt-3">
                  <span className="text-4xl font-bold text-zinc-100 tabular-nums">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="mt-1.5 block text-[10px] text-amber-400/90 font-mono uppercase tracking-wider">
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className="mt-3 text-xs text-zinc-400 leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-2.5 flex-1">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-xs text-zinc-400"
                  >
                    <svg
                      className="w-4 h-4 text-orange-500 shrink-0 mt-0.5"
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
                    {feature}
                  </li>
                ))}
              </ul>

              {plan.id === "demo" ? (
                <Link
                  href={plan.ctaHref || "/quiz?demo=true"}
                  className="w-full rounded-lg text-xs font-semibold uppercase tracking-wider py-3 border border-zinc-700 text-zinc-200 hover:bg-zinc-800 hover:text-white transition-all text-center"
                >
                  {plan.cta}
                </Link>
              ) : success ? (
                <div className="w-full rounded-lg text-xs font-semibold uppercase tracking-wider py-3 bg-green-600 text-white text-center">
                  ✓ Premium Activated!
                </div>
              ) : (
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
              )}
            </div>
          ))}
        </div>

        {/* Back link — styled button */}
        <div className="mt-12 text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-all text-sm font-medium"
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