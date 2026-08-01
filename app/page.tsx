import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pyro Prep Academy — California Pyrotechnic License Study Guide",
  description:
    "Practice questions, detailed explanations, and study tools built directly from CA Title 19 regulations.",
};

const METRICS = [
  { value: "94%", label: "First-attempt pass rate" },
  { value: "1,200+", label: "Operators certified" },
  { value: "15 yr", label: "Lead instructor experience" },
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
    description: "Work through the course on your own time.",
    features: [
      "Full 4-module curriculum",
      "500+ question practice bank",
      "Module workbooks (PDF)",
      "2 mock final exams",
      "Email support",
    ],
    cta: "Enroll self-study",
    highlighted: false,
  },
  {
    name: "Live Class",
    price: "$1,295",
    cadence: "per seat",
    description: "8 weeks of live classes with the lead instructor.",
    features: [
      "Everything in Self-Study",
      "Weekly live Zoom sessions",
      "OSFM paperwork walkthrough",
      "1:1 readiness review",
      "Lifetime course updates",
    ],
    cta: "Enroll live class",
    highlighted: true,
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
    cta: "Enroll team",
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

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-black/85 backdrop-blur-md border-b border-zinc-800 shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <a href="/" className="flex items-center gap-2.5 min-w-0">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-red-600 to-orange-500 text-white font-bold text-xs shadow-[0_0_18px_rgba(234,88,12,0.35)]">
                P
              </span>
              <span className="truncate text-sm sm:text-base font-semibold text-white tracking-tight">
                Pyro Prep Academy
              </span>
            </a>
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              CA — OSFM
            </span>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
              <a href="#syllabus" className="hover:text-white transition-colors font-semibold">
                Syllabus
              </a>
              <a href="#features" className="hover:text-white transition-colors font-semibold">
                Features
              </a>
              <a href="#pricing" className="hover:text-white transition-colors font-semibold">
                Pricing
              </a>
            </nav>
            <a
              href="#pricing"
              className="inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white text-xs sm:text-sm font-semibold tracking-wide px-3.5 sm:px-4 py-2 transition-all shadow-[0_0_20px_rgba(234,88,12,0.25)]"
            >
              Enroll now
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-black">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(234,88,12,0.10),transparent_55%)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-24 sm:pt-20 sm:pb-28 lg:pt-24 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              Next live class opens March 14
            </span>

            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.05] tracking-tight text-white uppercase">
              Earn your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                CA Pyrotechnic
              </span>{" "}
              Operator license.
            </h1>

            <p className="body-strong mt-6 max-w-xl text-base sm:text-lg leading-relaxed">
              Practice questions, detailed explanations, and study tools built directly
              from CA Title 19 regulations. Live classes are taught by a licensed
              California operator with 15 years on display crews.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a
                href="#pricing"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-semibold uppercase tracking-wider text-sm sm:text-base px-6 py-3.5 transition-all shadow-[0_0_24px_rgba(234,88,12,0.30)]"
              >
                Enroll now
                <ArrowRightIcon className="h-4 w-4" />
              </a>
              <a
                href="#syllabus"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900 text-zinc-200 hover:text-white font-semibold uppercase tracking-wider text-sm sm:text-base px-6 py-3.5 transition-all"
              >
                See syllabus
              </a>
            </div>

            <dl className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 border-t border-zinc-900 pt-8">
              {METRICS.map((m, i) => (
                <div
                  key={m.label}
                  className={`flex flex-col gap-1 ${
                    i > 0 ? "sm:pl-6 sm:border-l sm:border-zinc-900" : ""
                  }`}
                >
                  <dt className="text-2xl sm:text-3xl font-extrabold text-amber-400 tabular-nums tracking-tight">
                    {m.value}
                  </dt>
                  <dd className="text-xs sm:text-sm text-zinc-400 leading-snug">
                    {m.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-5">
            <div className="surface-card relative rounded-2xl p-6 sm:p-8">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-5 gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
                    License blueprint
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                    94% pass
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
                    Operator license
                  </p>
                  <p className="mt-1 text-lg sm:text-xl font-bold text-white">
                    California Pyrotechnic Operator
                  </p>
                  <p className="text-sm text-zinc-400">Class B — outdoor display</p>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  {[
                    { k: "Issued", v: "OSFM" },
                    { k: "Term", v: "Annual" },
                    { k: "Exam", v: "Pearson VUE" },
                  ].map((row) => (
                    <div
                      key={row.k}
                      className="rounded-lg border border-zinc-800 bg-black/40 p-3"
                    >
                      <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                        {row.k}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-white">
                        {row.v}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2.5 pt-2">
                  {[
                    "Self-Paced Course",
                    "Module workbooks",
                    "500+ practice questions",
                    "Live Class (Coming Soon!)",
                  ].map((line, idx) => (
                    <div key={line} className="flex items-center gap-3 text-sm">
                      <span className="font-mono text-[10px] text-zinc-600 w-5">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                      <span className="text-zinc-200">{line}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-zinc-800 pt-5">
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
                      Holder
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      Class B operator
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
                      Status
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                      Pre-licensed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
            and the field operations you'll be tested on.
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
            What's in the course
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
            <article className="surface-card relative overflow-hidden rounded-xl p-8 sm:p-10 flex flex-col justify-between min-h-[320px] h-full">
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
          <article className="surface-card relative overflow-hidden rounded-xl p-7 sm:p-8 flex flex-col justify-between min-h-[200px]">
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
          <article className="surface-card relative overflow-hidden rounded-xl p-7 sm:p-8 flex flex-col justify-between min-h-[200px]">
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
            Three ways to take the course.
          </h2>
          <p className="mt-5 text-base sm:text-lg text-zinc-400 leading-relaxed">
            Self-paced, live class, or team licensing for display companies.
            All packages include lifetime updates.
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
                <div className={`h-full w-full rounded-[11px] p-7 sm:p-8 flex flex-col ${isHighlighted ? "surface-card-accent" : "surface-card"}`}>
                  {isHighlighted && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-orange-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-[0_0_18px_rgba(234,88,12,0.4)]">
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
        <div className="flex items-center gap-2.5">
          <span className="grid h-6 w-6 place-items-center rounded-md bg-gradient-to-br from-red-600 to-orange-500 text-white font-bold text-[10px]">
            P
          </span>
          <span className="text-sm font-semibold text-white tracking-tight">
            Pyro Prep Academy
          </span>
        </div>
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
      <Header />
      <Hero />
      <Syllabus />
      <Bento />
      <Pricing />
      <Footer />
    </main>
  );
}