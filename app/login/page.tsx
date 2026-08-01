"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseClient } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createSupabaseClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm">
        {/* Logo / Brand */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-xl font-bold text-zinc-100 tracking-tight">
              Pyro Prep Academy
            </span>
          </Link>
          <p className="mt-2 text-xs text-zinc-300 font-mono uppercase tracking-widest">
            Operator Exam Login
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-8">
          <h1 className="text-sm font-semibold uppercase tracking-wider text-zinc-200 mb-6">
            Sign In
          </h1>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-[11px] font-mono uppercase tracking-widest text-zinc-300 mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-zinc-800 bg-black px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/50 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-[11px] font-mono uppercase tracking-widest text-zinc-300 mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-zinc-800 bg-black px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/50 transition-colors"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs text-red-400 font-mono">{error}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-orange-800 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold uppercase tracking-wider py-3 transition-colors"
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>

          {/* Sign-up link */}
          <p className="mt-6 text-center text-xs text-zinc-300 font-mono uppercase tracking-wider">
            No account?{" "}
            <Link
              href="/signup"
              className="text-orange-500 underline underline-offset-2 hover:text-orange-400 transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}