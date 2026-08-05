import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-zinc-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 uppercase tracking-tight mb-6">
          Contact Support
        </h1>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-8">
          <p className="text-sm text-zinc-400 mb-4">
            For technical support, billing questions, or general inquiries, please reach out to our team:
          </p>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">Email</p>
              <a href="mailto:support@pyroprep.academy" className="text-sm text-amber-400 hover:text-amber-300 transition-colors">
                support@pyroprep.academy
              </a>
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">Response Time</p>
              <p className="text-sm text-zinc-300">We typically respond within 24–48 hours.</p>
            </div>
          </div>
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