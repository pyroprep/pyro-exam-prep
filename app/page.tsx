import Link from "next/link";

const HERO_STATS = [
  { value: "94%", label: "First-Attempt Pass Rate" },
  { value: "100+", label: "Operators Prepared" },
  { value: "500+", label: "Title 19 Practice Questions" },
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
    price: "$249",
    cadence: "one-time · lifetime access",
    description: "Study at your own pace with immediate access to all course materials.",
    features: [
      "Full 4-module curriculum",
      "500+ CA Title 19 question bank",
      "100-question timed mock exams",
      "Module workbooks (PDF)",
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
    description:
      "Instructor-led sessions will be offered in the future. Join the self-study course to prepare now.",
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
    <section className="relative overflow-hidden bg-zinc-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/15 via-zinc-950 to-zinc-950"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.03]"
      />

      <div className="relative py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-400">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                Self-Paced License Prep Course
              </span>

              <h1 className="mt-6 max-w-3xl text-left text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-br from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                  Pass the
                </span>{" "}
                <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent font-extrabold">
                  CA
                </span>{" "}
                <span className="bg-gradient-to-br from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                  Pyrotechnic Operator Exam.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-left text-base leading-relaxed text-zinc-400 sm:text-lg">
                Master CA Title 19 regulations with 500+ practice questions,
                realistic timed mock exams, and instant answer explanations for
                Class B and Class C candidates in our prep course.
              </p>

              <div className="mt-8 flex flex-col justify-start gap-3 sm:flex-row sm:gap-4">
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-3.5 font-bold text-zinc-950 shadow-lg shadow-orange-500/20 transition-all duration-200 hover:from-amber-400 hover:to-orange-500 hover:shadow-orange-500/35 active:scale-[0.98]"
                >
                  Enroll now
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
                <a
                  href="#syllabus"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700/80 bg-zinc-900/80 px-6 py-3.5 font-medium text-zinc-200 transition-all duration-200 hover:-translate-y-0.5 hover:bg-zinc-800 active:scale-[0.98]"
                >
                  See syllabus
                </a>
              </div>

              <div className="mt-12 grid grid-cols-1 gap-8 border-t border-white/10 pt-8 sm:grid-cols-3">
                {HERO_STATS.map((s) => (
                  <div key={s.label} className="flex flex-col gap-1 text-left">
                    <p className="text-3xl font-extrabold tracking-tight text-amber-400 tabular-nums sm:text-4xl">
                      {s.value}
                    </p>
                    <p className="text-sm text-zinc-400">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 shadow-2xl shadow-amber-500/5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5">
                <div className="flex items-center justify-between gap-4 border-b border-white/10 bg-white/5 px-4 py-3 sm:px-5">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-500" />
                    <span className="h-3 w-3 rounded-full bg-yellow-500" />
                    <span className="h-3 w-3 rounded-full bg-green-500" />
                  </div>
                  <span className="inline-flex items-center rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[10px] font-semibold tracking-wider text-amber-400">
                    PLATFORM PREVIEW
                  </span>
                </div>

                <div className="p-6 sm:p-8">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-zinc-950/40 p-5">
                      <span className="inline-flex items-center rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-amber-400">
                        Class B
                      </span>
                      <p className="mt-3 text-sm font-semibold text-zinc-100">
                        1.3G Display
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                        Large aerial displays & consumer-grade 1.3G fireworks
                        operations.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-zinc-950/40 p-5">
                      <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-zinc-300">
                        Class C
                      </span>
                      <p className="mt-3 text-sm font-semibold text-zinc-100">
                        1.4G Commercial
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                        Commercial pyrotechnics & 1.4G professional use.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2">
                    <CheckIcon className="h-3.5 w-3.5 text-amber-400" />
                    <span className="text-xs font-medium text-amber-400">
                      500+ CA Title 19 Questions · Timed Mock Exams
                    </span>
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
    <section id="syllabus" className="relative overflow-hidden bg-zinc-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-zinc-950 to-zinc-950"
      />
      <div className="relative py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Course Overview
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Four Core Modules. One Complete Prep Course.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-zinc-400 sm:text-lg">
              Targeted prep covering California pyrotechnic law, explosive
              chemistry, and real-world field operations for exam preparation,
              not licensing issuance.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
            {TRACKS.map((track) => (
              <article
                key={track.number}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 p-7 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5 sm:p-8"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-amber-500/5 blur-2xl"
                />
                <div className="flex items-start gap-5">
                  <span className="shrink-0 bg-gradient-to-br from-amber-400 to-orange-500 bg-clip-text text-5xl font-extrabold leading-none text-transparent transition-colors group-hover:from-amber-300 group-hover:to-orange-400 sm:text-6xl tabular-nums">
                    {track.number}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                      {track.title}
                    </h3>
                    <ul className="mt-5 space-y-2.5">
                      {track.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 text-sm text-zinc-400 sm:text-[15px]"
                        >
                          <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
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
      </div>
    </section>
  );
}

function Bento() {
  return (
    <section id="features" className="relative overflow-hidden bg-zinc-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-zinc-950 to-zinc-950"
      />
      <div className="relative py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Course Overview
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Master Every Section of the Exam.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-zinc-400 sm:text-lg">
              Access targeted question banks, interactive workbooks, and HD
              video walkthroughs built directly from current OSFM guidelines.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
            <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5 md:col-span-2 md:row-span-2 sm:p-8 min-h-[320px]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-amber-500/5 blur-2xl"
              />
              <div className="relative flex h-full flex-col justify-between">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    Practice bank
                  </span>
                  <h3 className="mt-5 bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl lg:text-4xl">
                    500+ question practice bank
                  </h3>
                  <ul className="mt-4 space-y-3">
                    <li className="flex items-start gap-3 text-sm text-zinc-400 sm:text-base">
                      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
                        <CheckIcon className="h-3 w-3" />
                      </span>
                      <span>Timed exam simulations mirroring official OSFM cycles.</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-zinc-400 sm:text-base">
                      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
                        <CheckIcon className="h-3 w-3" />
                      </span>
                      <span>Realistic Title 19 questions with immediate code rationales.</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { k: "Questions", v: "500+" },
                    { k: "Modules", v: "4" },
                    { k: "Domains", v: "12" },
                    { k: "Updated", v: "2026" },
                  ].map((s) => (
                    <div
                      key={s.k}
                      className="rounded-2xl border border-white/10 bg-zinc-950/40 p-4"
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                        {s.k}
                      </p>
                      <p className="mt-1 text-xl font-extrabold tracking-tight text-amber-400 tabular-nums sm:text-2xl">
                        {s.v}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5 min-h-[200px]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-16 -right-16 h-44 w-44 rounded-full bg-amber-500/5 blur-2xl"
              />
              <div className="relative flex h-full flex-col justify-between">
                <div>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
                    <DownloadIcon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-xl font-bold tracking-tight text-white sm:text-2xl">
                    Module workbooks (PDF)
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                    Printable reference study guides mapped directly to the
                    active state syllabus.
                  </p>
                </div>
                <p className="relative mt-6 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  4 PDFs · 180+ pages
                </p>
              </div>
            </article>

            <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5 min-h-[200px]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-amber-500/5 blur-2xl"
              />
              <div className="relative flex h-full flex-col justify-between">
                <div>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
                    <MediaLayoutIcon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-xl font-bold tracking-tight text-white sm:text-2xl">
                    60+ HD walkthrough videos
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                    Field breakdowns of fall-out radius math, mortar rigging,
                    and state paperwork.
                  </p>
                </div>
                <p className="relative mt-6 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  60+ videos · HD
                </p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="relative overflow-hidden bg-zinc-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/15 via-zinc-950 to-zinc-950"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.03]"
      />

      <div className="relative py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Pricing
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Choose your prep plan.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-zinc-400 sm:text-lg">
              Start studying today with our self-paced prep course. Team
              training is available for display companies, and all materials
              are designed for exam prep rather than licensing issuance.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3 items-stretch">
            {PRICING.map((tier) => {
              const isHighlighted = tier.highlighted;
              return (
                <article
                  key={tier.name}
                  className={`relative overflow-hidden rounded-2xl border bg-zinc-900/60 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5 sm:p-8 ${
                    isHighlighted ? "border-amber-500/30 ring-1 ring-amber-500/20" : "border-white/10"
                  }`}
                >
                  {isHighlighted && (
                    <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-400 shadow-[0_0_18px_rgba(234,88,12,0.2)]">
                      Most popular
                    </span>
                  )}

                  <div className="flex h-full flex-col">
                    <div>
                      <h3 className="text-lg font-semibold tracking-tight text-white">
                        {tier.name}
                      </h3>
                      <div className="mt-5 flex items-baseline gap-2">
                        <span className="text-4xl font-extrabold tracking-tight text-zinc-100 tabular-nums sm:text-5xl">
                          {tier.price}
                        </span>
                        <span className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                          {tier.cadence}
                        </span>
                      </div>
                      <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                        {tier.description}
                      </p>
                    </div>

                    <ul className="mt-7 space-y-3 flex-1">
                      {tier.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-3 text-sm text-zinc-400"
                        >
                          <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
                            <CheckIcon className="h-3 w-3" />
                          </span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    <a
                      href="#"
                      className={`mt-8 mb-2 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold uppercase tracking-wider transition-all duration-200 active:scale-[0.98] ${
                        isHighlighted
                          ? "bg-gradient-to-r from-amber-500 to-orange-600 text-zinc-950 shadow-lg shadow-orange-500/20 hover:from-amber-400 hover:to-orange-500 hover:shadow-orange-500/35"
                          : "border border-zinc-700/80 bg-zinc-900/80 text-zinc-200 hover:bg-zinc-800 hover:text-white"
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
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen flex-1 bg-zinc-950 text-zinc-100">
      <Hero />
      <Syllabus />
      <Bento />
      <Pricing />
    </main>
  );
}
