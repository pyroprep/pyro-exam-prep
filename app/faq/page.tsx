import Link from "next/link";

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-zinc-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 uppercase tracking-tight mb-6">
          Frequently Asked Questions
        </h1>
        <div className="space-y-4">
          {[
            {
              q: "Who is Pyro Prep Academy for?",
              a: "Our platform is designed as a California Class B Pyrotechnic Operator license prep course for candidates studying for the exam.",
            },
            {
              q: "Is this an official OSFM course?",
              a: "No. We are an independent educational prep course and are not affiliated with OSFM or CAL FIRE. Always refer to Title 19 and official OSFM guidance.",
            },
            {
              q: "How does the 100-question mock exam work?",
              a: "It pulls 25 questions from each module, randomizes them, and runs a timed 2-hour session with pass/fail scoring at 70%.",
            },
            {
              q: "Can I retake modules?",
              a: "Yes. Study mode and exams can be retaken as often as you need.",
            },
          ].map((item) => (
            <div key={item.q} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
              <p className="text-sm font-semibold text-zinc-200 mb-2">{item.q}</p>
              <p className="text-xs text-zinc-400 leading-relaxed">{item.a}</p>
            </div>
          ))}
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