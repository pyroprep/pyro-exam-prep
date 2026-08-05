import Image from "next/image";
import Link from "next/link";

const METRICS = [
  { value: "94%", label: "First-attempt pass rate" },
  { value: "500+", label: "Practice questions" },
  { value: "4", label: "Comprehensive modules" },
];

const TRUST_BADGES = [
  { label: "100+ Title 19 Practice Questions" },
  { label: "10 Audio-Narrated Video Modules" },
  { label: "Interactive Table 19-A Fallout Calculator" },
  { label: "100% Pass Guarantee" },
];

const TRACKS = [
  {
    number: "01",
    title: "California Fireworks Law",
    items: [
      "Title 19 regulatory framework",
      "OSFM licensing pathways",
      "Permit acquisition & renewals",
      "Liability & insurance minimums",
    ],
  },
  {
    number: "02",
    title: "Pyrotechnic Chemistry",
    items: [
      "Oxidizers, fuels & binders",
      "Color & sound compositions",
      "Hazard classification (1.1G–1.4G)",
      "Storage compatibility groups",
    ],
  },
  {
    number: "03",
    title: "Display Site Operations",
    items: [
      "Fall-out zone calculations",
      "Audience separation distances",
      "Wind & weather thresholds",
      "Mortar rigging & set pieces",
    ],
  },
  {
    number: "04",
    title: "Emergency & Safety",
    items: [
      "Pre-show safety briefings",
      "Misfire & dud procedures",
      "Fire suppression protocols",
      "Incident command reporting",
    ],
  },
];

const PRICING = [
  {
    name: "Self-Study",
    price: "$349",
    cadence: "one-time",
    description: "Study at your own pace with immediate access to all course materials.",
    features: [
      "Full 4-module curriculum",
      "500+ question practice bank",
      "Module workbooks (PDF)",
      "2 mock final exams",
      "Video walkthroughs",
      "Study on your own schedule",
    ],
    cta: "Enroll Self-Study",
    highlighted: true,
  },
  {
    name: "Live Class",
    price: "Coming Soon",
    cadence: "",
    description: "Instructor-led sessions will be offered in the future. Join the self-study course to prepare now.",
    features: [
      "Everything in Self-Study",
      "Weekly live sessions",
      "OSFM paperwork walkthrough",
      "1:1 readiness review",
      "Lifetime course updates",
    ],
    cta: "Join Waitlist",
    highlighted: false,
  },
  {
    name: "Employer",
    price: "Custom",
    cadence: "per team",
    description: "For display companies training multiple operators.",
    features: [
      "Volume seat pricing",
      "Private class scheduling",
      "Compliance reporting",
      "Dedicated account manager",
      "On-site option available",
    ],
    cta: "Contact us",
    highlighted: false,
  },
];

function CheckIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4 10.5l3.5 3.5L16 6" />
    </svg>
  );
}

function ArrowRightIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function DownloadIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M7 10l5 5 5-5" />
      <path d="M12 15V3" />
    </svg>
  );
}

function MediaLayoutIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3" y="3" width="18" height="14" rx="2" />
      <path d="M3 10h18" />
      <path d="M10 21h10" />
      <path d="M7 21h2" />
    </svg>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-black">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(234,88,12,0.10),transparent_55%)]"
      />

      <div className="relative py-20 lg:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-400">
            Updated for CA Title 19 & OSFM Standards
          </span>

          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.05] tracking-tight text-white uppercase">
            Master the California Title 19 Pyrotechnic Exam
          </h1>

          <p className="body-strong mt-6 mx-auto max-w-3xl text-base sm:text-lg leading-relaxed text-zinc-300">
            The complete interactive study platform for CA Class B (1.3G Display) & Class C (1.4G Commercial) Pyrotechnic Operator Licenses.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a
              href="#pricing"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-zinc-950 font-bold px-8 py-4 shadow-lg shadow-orange-500/20 transition-all scale-105"
            >
              Start Free Practice Test
              <ArrowRightIcon className="h-4 w-4" />
            </a>
            <a
              href="#syllabus"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900 text-zinc-200 hover:text-white font-bold uppercase tracking-wider text-sm sm:text-base px-8 py-4 transition-all"
            >
              Get Full Access
            </a>
          </div>

          <dl className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4 border-t border-zinc-900 pt-8">
            {TRUST_BADGES.map((m) => (
              <div key={m.label} className="flex flex-col gap-1">
                <dt className="text-sm font-bold text-amber-400 tracking-tight">
                  {m.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function Syllabus() {
  return (
    <section id="syllabus" className="bg-black">
      <div className="section-space mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
            The curriculum
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Four modules. One license.{" "}
            <span className="text-zinc-400">Built around CA Title 19.</span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-zinc-400 leading-relaxed">
            Each module covers a section of the state exam. The law, the chemistry,
            and the field operations you&apos;ll be tested on.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-5">
          {TRACKS.map((track) => (
            <article
              key={track.number}
              className="surface-card group relative rounded-xl p-7 sm:p-8 hover:border-amber-400/30 transition-colors"
            >
              <div className="flex items-start gap-5">
                <span className="shrink-0 text-5xl sm:text-6xl font-extrabold leading-none text-amber-400/30 group-hover:text-amber-400/60 transition-colors tabular-nums">
                  {track.number}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {track.title}
                  </h3>
                  <ul className="mt-5 space-y-2.5">
                    {track.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-sm sm:text-[15px] text-zinc-300"
                      >
                        <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-amber-400/40 text-amber-400">
                          <CheckIcon className="h-3 w-3" />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Bento() {
  return (
    <section id="features" className="bg-zinc-950/50 border-y border-zinc-900">
      <div className="section-space mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
            {"What\u2019s in the course"}
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Study materials for the whole exam.
          </h2>
          <p className="mt-5 text-base sm:text-lg text-zinc-400 leading-relaxed">
            Practice bank, workbooks, and walkthrough videos — written and filmed
            from the actual OSFM exam outline.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Large 2/3 card — 500+ Question Practice Bank */}
          <div className="md:col-span-2 md:row-span-2 p-[1px] bg-gradient-to-br from-red-600 via-orange-500 to-transparent rounded-xl">
            <article className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 sm:p-8 hover:border-zinc-700 transition-all flex flex-col justify-between min-h-[320px] h-full">
              <div>
                <div className="relative">
                  <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    Practice bank
                  </span>
                  <h3 className="mt-5 text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                    500+ question practice bank
                  </h3>
                  <ul className="mt-4 space-y-3">
                    <li className="flex items-start gap-3 text-sm sm:text-base text-zinc-300">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-amber-400/40 text-amber-400">
                        <CheckIcon className="h-3 w-3" />
                      </span>
                      <span>Timed exam simulations mirroring official OSFM cycles.</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm sm:text-base text-zinc-300">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-amber-400/40 text-amber-400">
                        <CheckIcon className="h-3 w-3" />
                      </span>
                      <span>Realistic Title 19 questions with immediate code rationales.</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { k: "Questions", v: "500+" },
                    { k: "Modules", v: "4" },
                    { k: "Domains", v: "12" },
                    { k: "Updated", v: "2026" },
                  ].map((s) => (
                    <div
                      key={s.k}
                      className="rounded-lg border border-zinc-800 bg-black/40 p-4"
                    >
                      <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                        {s.k}
                      </p>
                      <p className="mt-1 text-xl sm:text-2xl font-extrabold text-amber-400 tabular-nums">
                        {s.v}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>

          {/* Top right card — Module Workbooks (PDF) */}
          <article className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all flex flex-col justify-between min-h-[200px]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-16 -right-16 h-44 w-44 rounded-full bg-amber-400/5 blur-2xl"
            />
            <div className="relative">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-amber-400/10 text-amber-400">
                <DownloadIcon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-xl sm:text-2xl font-bold text-white">
                Module workbooks (PDF)
              </h3>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                Printable reference study guides mapped directly to the active state syllabus.
              </p>
            </div>
            <p className="relative mt-6 text-xs font-mono uppercase tracking-wider text-zinc-500">
              4 PDFs · 180+ pages
            </p>
          </article>

          {/* Bottom right card — 60+ HD Walkthrough Videos */}
          <article className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all flex flex-col justify-between min-h-[200px]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-amber-400/5 blur-2xl"
            />
            <div className="relative">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-amber-400/10 text-amber-400">
                <MediaLayoutIcon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-xl sm:text-2xl font-bold text-white">
                60+ HD walkthrough videos
              </h3>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                Field breakdowns of fall-out radius math, mortar rigging, and state paperwork.
              </p>
            </div>
            <p className="relative mt-6 text-xs font-mono uppercase tracking-wider text-zinc-500">
              60+ videos · HD
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="bg-black">
      <div className="section-space mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
            Pricing
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Choose your plan.
          </h2>
          <p className="mt-5 text-base sm:text-lg text-zinc-400 leading-relaxed">
            Start studying today with our self-paced course. A live class is
            coming soon, and team licensing is available for display companies.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {PRICING.map((tier) => {
            const isHighlighted = tier.highlighted;
            return (
              <article
                key={tier.name}
                className={`relative rounded-xl p-[1.5px] ${
                  isHighlighted
                    ? "bg-gradient-to-b from-orange-500 to-red-600"
                    : "bg-zinc-800"
                }`}
              >
                <div className={`h-full w-full rounded-2xl p-6 sm:p-8 flex flex-col ${isHighlighted ? "bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-all" : "bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-all"}`}>
                  {isHighlighted && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-zinc-950 shadow-[0_0_18px_rgba(234,88,12,0.4)]">
                      Most popular
                    </span>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-white tracking-tight">
                      {tier.name}
                    </h3>
                    <div className="mt-5 flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-extrabold text-white tabular-nums tracking-tight">
                        {tier.price}
                      </span>
                      <span className="text-sm text-zinc-500 uppercase tracking-wider font-semibold">{tier.cadence}</span>
                    </div>
                    <p className="mt-4 text-sm text-zinc-300 leading-relaxed">
                      {tier.description}
                    </p>
                  </div>

                  <ul className="mt-7 space-y-3 flex-1">
                    {tier.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-3 text-sm text-zinc-300"
                      >
                        <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-amber-400/40 text-amber-400">
                          <CheckIcon className="h-3 w-3" />
                        </span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#"
                    className={`mt-8 mb-2 inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold uppercase tracking-wider transition-all ${
                      isHighlighted
                        ? "bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white shadow-[0_0_22px_rgba(234,88,12,0.30)]"
                        : "border border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900 text-zinc-200 hover:text-white"
                    }`}
                  >
                    {tier.cta}
                    <ArrowRightIcon className="h-4 w-4" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-zinc-900 bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-16 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            alt="Pyro Prep Academy"
            className="h-6 w-auto"
            height={100}
            src="/logo.png"
            width={440}
          />
        </Link>
        <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-300 text-center sm:text-right">
          Not affiliated with OSFM or Pearson VUE · For training purposes only
        </p>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen flex-1 bg-black text-zinc-100">
      <Hero />
      <Syllabus />
      <Bento />
      <Pricing />
      <Footer />
    </main>
  );
}