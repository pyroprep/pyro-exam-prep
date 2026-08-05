"use client";

import dynamic from "next/dynamic";

// The AI tutor is a floating, below-the-fold widget that is not needed for
// first paint. Load it client-side only, after hydration, so its code never
// blocks the main thread during initial page load (TBT/LCP optimization).
const TutorChat = dynamic(() => import("@/components/TutorChat"), {
  ssr: false,
});

export default function TutorChatLazy() {
  return <TutorChat />;
}