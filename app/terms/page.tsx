import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-zinc-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 uppercase tracking-tight mb-6">
          Terms of Service
        </h1>
        <div className="space-y-6 text-sm text-zinc-400 leading-relaxed">
          <p>
            By accessing or using Pyro Prep Academy (&quot;the Service&quot;), you agree to be bound by these Terms of Service.
            If you do not agree to these terms, please do not use the Service.
          </p>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-300 mb-3">
              Educational Use Only
            </h2>
            <p>
              Pyro Prep Academy is an independent educational platform and is not affiliated with, endorsed by,
              or sponsored by the California Office of the State Fire Marshal (OSFM), CAL FIRE, Pearson VUE,
              or any governmental agency. All study materials, practice questions, and reference tools are
              provided for educational purposes only and do not constitute official regulatory guidance.
              Candidates should always refer to the current California Code of Regulations, Title 19,
              and official OSFM publications for authoritative requirements.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-300 mb-3">
              Account Responsibilities
            </h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and for all
              activities under your account. You agree to notify us immediately of any unauthorized use.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-300 mb-3">
              Pass Guarantee Terms
            </h2>
            <p>
              Our 100% Pass Guarantee applies only to the $249 Premium plan. To qualify, you must complete
              all 4 study modules and the 100-question mock exam, attempt the official OSFM Class B exam
              within 12 months of purchase, and score below the 70% passing threshold. Claims must be
              submitted within 30 days of your exam date via the guarantee claim portal.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-300 mb-3">
              Refund Policy
            </h2>
            <p>
              All purchases are final except as covered by the Pass Guarantee. Refunds under the guarantee
              are processed within 10–14 business days after claim approval.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-300 mb-3">
              Limitation of Liability
            </h2>
            <p>
              Pyro Prep Academy shall not be liable for any indirect, incidental, special, consequential,
              or punitive damages resulting from your use of the Service. We do not guarantee exam success
              and are not responsible for outcomes of official OSFM examinations.
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