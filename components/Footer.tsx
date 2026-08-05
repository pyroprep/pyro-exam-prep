import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-zinc-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-zinc-950 to-zinc-950"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-amber-400">
              California Title 19
            </span>
            <h3 className="mt-4 text-sm font-semibold tracking-tight text-zinc-100">
              Pyro Prep Academy
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400">
              California&apos;s premier exam preparation platform for Class B
              (1.3G Display) & Class C (1.4G Commercial) Pyrotechnic Operator
              candidates. 500+ CA Title 19 practice questions with 100-question
              timed mock exams — $249 one-time lifetime access.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-zinc-300 transition-colors hover:text-amber-400">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/quiz" className="text-sm text-zinc-300 transition-colors hover:text-amber-400">
                  Study Modules
                </Link>
              </li>
              <li>
                <Link href="/dashboard#calculator" className="text-sm text-zinc-300 transition-colors hover:text-amber-400">
                  Fallout Calculator
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-zinc-300 transition-colors hover:text-amber-400">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Support
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-sm text-zinc-300 transition-colors hover:text-amber-400">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-zinc-300 transition-colors hover:text-amber-400">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/certificate" className="text-sm text-zinc-300 transition-colors hover:text-amber-400">
                  Exam Certificate
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-zinc-300 transition-colors hover:text-amber-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-zinc-300 transition-colors hover:text-amber-400">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8">
          <div className="max-w-3xl">
            <p className="text-xs leading-relaxed text-zinc-400">
              Pyro Prep Academy is an independent educational platform and is
              not affiliated with, endorsed by, or sponsored by the California
              Office of the State Fire Marshal (OSFM), CAL FIRE, Pearson VUE,
              or any governmental agency. All study materials, practice
              questions, and reference tools are provided for educational
              purposes only and do not constitute official regulatory guidance.
              Candidates should always refer to the current California Code of
              Regulations, Title 19, and official OSFM publications for
              authoritative requirements.
            </p>
          </div>

          <div className="mt-6">
            <p className="text-xs leading-relaxed text-zinc-400">
              &copy; {new Date().getFullYear()} Pyro Prep Academy. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
