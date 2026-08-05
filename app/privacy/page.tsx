import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-zinc-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 uppercase tracking-tight mb-6">
          Privacy Policy
        </h1>
        <div className="space-y-6 text-sm text-zinc-400 leading-relaxed">
          <p>
            Pyro Prep Academy (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, and safeguard your information when you use our platform.
          </p>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-300 mb-3">
              Information We Collect
            </h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>Account information (email, name) via Supabase authentication</li>
              <li>Quiz progress and performance data stored locally on your device</li>
              <li>Usage analytics to improve the learning experience</li>
              <li>Payment information processed securely through PayPal</li>
            </ul>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-300 mb-3">
              How We Use Your Information
            </h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>Provide and improve the exam preparation platform</li>
              <li>Track your progress and personalize your learning experience</li>
              <li>Process payments and manage subscriptions</li>
              <li>Send important updates about your account or purchases</li>
            </ul>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-300 mb-3">
              Data Security
            </h2>
            <p>
              We implement industry-standard security measures to protect your personal information.
              All payment processing is handled by PayPal. Authentication is managed by Supabase,
              which maintains SOC 2 Type II compliance.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-300 mb-3">
              Your Rights
            </h2>
            <p>
              You have the right to access, correct, or delete your personal data at any time.
              To make a request, contact us at support@pyroprep.academy.
            </p>
          </div>
          <p className="text-xs text-zinc-500">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="mt-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-zinc-700 bg-zinc-900/60 hover:border-zinc-600 hover:bg-zinc-900 text-zinc-200 font-semibold uppercase tracking-wider text-sm px-6 py-3 transition-all"
          >
            ← Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}