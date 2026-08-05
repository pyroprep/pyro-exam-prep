import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider mb-4">
              Pyro Prep Academy
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              California's premier exam preparation platform for Class B (1.3G Display) & Class C (1.4G Commercial) Pyrotechnic Operator candidates. 500+ CA Title 19 practice questions with 100-question timed mock exams — $249 one-time lifetime access.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-200 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/quiz" className="text-xs text-zinc-500 hover:text-zinc-200 transition-colors">
                  Study Modules
                </Link>
              </li>
              <li>
                <Link href="/dashboard#calculator" className="text-xs text-zinc-500 hover:text-zinc-200 transition-colors">
                  Fallout Calculator
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-xs text-zinc-500 hover:text-zinc-200 transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-4">
              Support
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-xs text-zinc-500 hover:text-zinc-200 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-xs text-zinc-500 hover:text-zinc-200 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/certificate" className="text-xs text-zinc-500 hover:text-zinc-200 transition-colors">
                  Exam Certificate
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-4">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-xs text-zinc-500 hover:text-zinc-200 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-xs text-zinc-500 hover:text-zinc-200 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* OSFM Disclaimer */}
        <div className="mt-10 pt-8 border-t border-zinc-800">
          <div className="max-w-3xl">
            <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-600 leading-relaxed">
              <span className="text-zinc-500 font-semibold">OSFM Legal Disclaimer:</span>{" "}
              Pyro Prep Academy is an independent educational platform and is not affiliated with,
              endorsed by, or sponsored by the California Office of the State Fire Marshal (OSFM),
              CAL FIRE, or any governmental agency. All study materials, practice questions, and
              reference tools are provided for educational purposes only and do not constitute
              official regulatory guidance. Candidates should always refer to the current
              California Code of Regulations, Title 19, and official OSFM publications for
              authoritative requirements.
            </p>
          </div>

          <div className="mt-6">
            <p className="text-[10px] text-zinc-700 font-mono uppercase tracking-wider">
              &copy; {new Date().getFullYear()} Pyro Prep Academy. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}