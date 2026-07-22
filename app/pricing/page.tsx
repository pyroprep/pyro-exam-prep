"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PLANS = [
  {
    id: "basic",
    name: "Basic Commercial",
    price: "Free",
    description: "Essential prep for the Basic Commercial pyrotechnic operator exam.",
    features: [
      "Full Basic Commercial question bank",
      "Progress tracking & readiness scoring",
      "Mobile-optimized practice interface",
    ],
    cta: "Current Plan",
    highlighted: false,
  },
  {
    id: "premium",
    name: "Premium Unlock",
    price: "$19.99",
    period: "one-time",
    description: "Unlock all license tracks — Special Effects & Theatrical included.",
    features: [
      "Everything in Basic Commercial",
      "Special Effects question bank",
      "Theatrical Effects question bank",
      "Priority updates & new content",
      "Lifetime access (no subscription)",
    ],
    cta: "Upgrade Now",
    highlighted: true,
  },
];

export default function PricingPage() {
  const { user } = useAuth();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "";

  async function createPayPalOrder(): Promise<string> {
    if (!user) {
      throw new Error("Please sign in first to upgrade.");
    }

    setLoadingId("premium");

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
    setLoadingId(null);
    setSuccess(true);
    // Refresh the page so the dashboard picks up the new premium status
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 2000);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <Link href="/dashboard" className="inline-flex items-center gap-2 mb-4">
            <span className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-xl font-bold text-zinc-100 tracking-tight">
              PyroPrep
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight mt-4">
            Unlock Premium Tracks
          </h1>
          <p className="text-zinc-500 mt-2 text-sm font-mono uppercase tracking-wider">
            Choose the plan that fits your exam prep needs.
          </p>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-xl border p-8 flex flex-col gap-6 transition-all duration-200 ${
                plan.highlighted
                  ? "border-orange-500/50 bg-zinc-900/60 ring-1 ring-orange-500/20"
                  : "border-zinc-800 bg-zinc-900/40"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-orange-600 text-[10px] font-mono uppercase tracking-wider text-white">
                  Recommended
                </span>
              )}

              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-200">
                  {plan.name}
                </h2>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-zinc-100">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-xs text-zinc-500 font-mono uppercase tracking-wider">
                      / {plan.period}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
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

              {plan.id === "basic" ? (
                <button
                  type="button"
                  disabled
                  className="w-full rounded-lg text-xs font-semibold uppercase tracking-wider py-3 border border-zinc-700 text-zinc-500 cursor-not-allowed"
                >
                  {plan.cta}
                </button>
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
                      setLoadingId(null);
                    }}
                    onCancel={() => setLoadingId(null)}
                  />
                </PayPalScriptProvider>
              )}
            </div>
          ))}
        </div>

        {/* Back link */}
        <p className="mt-10 text-center">
          <Link
            href="/dashboard"
            className="text-xs text-zinc-600 hover:text-zinc-400 font-mono uppercase tracking-wider transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}