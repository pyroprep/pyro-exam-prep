export default function LogoTestPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-12 p-10 text-white">
      <h1 className="text-3xl font-bold tracking-tight">Pyro Prep Academy — Logo Concepts</h1>

      <div className="grid grid-cols-1 gap-16 sm:grid-cols-3">
        {/* Concept 1: Academic Flame */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-600 p-3 shadow-lg shadow-orange-500/20">
            <svg className="h-full w-full text-white" viewBox="0 0 24 24" fill="currentColor">
              {/* Flame */}
              <path d="M12 23c-4.97 0-8-3.58-8-8.25 0-3.9 2.9-7.23 5.46-9.58.55-.5 1.41-.11 1.41.63 0 1.25.75 2.2 1.8 2.2 1.35 0 2.33-1.12 2.33-2.47 0-.76-.23-1.52-.45-2.23-.2-.7.42-1.3 1.13-1.1 2.8 1.12 5.32 3.82 5.32 7.05C21 16.5 17.5 23 12 23z" opacity="0.8" />
              {/* Grad Cap Overlay */}
              <path d="M12 2l-7 3.5 7 3.5 7-3.5L12 2zm-5 6.5v3c0 2 2.2 3.5 5 3.5s5-1.5 5-3.5v-3l-5 2.5-5-2.5z" fill="#18181b" />
            </svg>
          </div>
          <span className="text-sm font-medium text-zinc-400">Academic Flame</span>
        </div>

        {/* Concept 2: Certified Pyro Seal */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-600 p-3 shadow-lg shadow-orange-500/20">
            <svg className="h-full w-full text-white" viewBox="0 0 24 24" fill="currentColor">
              {/* Outer Seal/Badge */}
              <path d="M12 2L15 4.5 18.5 4 19.5 7.5 22 9.5 20.5 13 22 16.5 19.5 18.5 18.5 22 15 21.5 12 24 9 21.5 5.5 22 4.5 18.5 2 16.5 3.5 13 2 9.5 4.5 7.5 5.5 4 9 4.5 12 2z" opacity="0.3" />
              {/* Inner Flame */}
              <path d="M12 19c-2.5 0-4-1.8-4-4.2 0-2 1.5-3.6 2.8-4.8.3-.2.7-.1.7.3 0 .6.4 1.1.9 1.1.7 0 1.2-.6 1.2-1.3 0-.4-.1-.8-.2-1.1-.1-.4.2-.7.6-.6 1.4.6 2.7 1.9 2.7 3.6C16 14.5 14.5 19 12 19z" />
            </svg>
          </div>
          <span className="text-sm font-medium text-zinc-400">Certified Pyro Seal</span>
        </div>

        {/* Concept 3: Spark Crest */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-600 p-3 shadow-lg shadow-orange-500/20">
            <svg className="h-full w-full text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {/* Mortar Tube Base */}
              <path d="M8 22h8" />
              <path d="M9 22v-6c0-1.5.5-2.5 1.5-3h3c1 .5 1.5 1.5 1.5 3v6" />
              {/* Burst/Sparks */}
              <path d="M12 2v4" />
              <path d="M12 8v1" />
              <path d="M19.07 4.93l-2.83 2.83" />
              <path d="M15.54 8.46l-.71.71" />
              <path d="M4.93 4.93l2.83 2.83" />
              <path d="M8.46 8.46l.71.71" />
              <path d="M2 12h4" />
              <path d="M8 12h1" />
              <path d="M22 12h-4" />
              <path d="M16 12h-1" />
            </svg>
          </div>
          <span className="text-sm font-medium text-zinc-400">Spark Crest</span>
        </div>
      </div>
    </div>
  );
}