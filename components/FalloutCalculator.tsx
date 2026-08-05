"use client";

import { useState } from "react";

interface FalloutResult {
  distance: number;
  unit: string;
  category: string;
}

export default function FalloutCalculator() {
  const [shellSize, setShellSize] = useState("");
  const [distance, setDistance] = useState("");
  const [result, setResult] = useState<FalloutResult | null>(null);

  const calculateFallout = () => {
    const size = parseFloat(shellSize);
    const dist = parseFloat(distance);

    if (isNaN(size) || isNaN(dist) || size <= 0 || dist < 0) {
      setResult(null);
      return;
    }

    // Simplified Table 19-A fallout distance calculation
    // Based on typical pyrotechnic fallout patterns
    let calculatedDistance: number;
    let category: string;

    if (size <= 2) {
      calculatedDistance = size * 50;
      category = "Small Display";
    } else if (size <= 4) {
      calculatedDistance = size * 70;
      category = "Medium Display";
    } else if (size <= 6) {
      calculatedDistance = size * 90;
      category = "Large Display";
    } else {
      calculatedDistance = size * 120;
      category = "Major Display";
    }

    // Adjust for distance input (safety factor)
    const safetyFactor = dist > 0 ? Math.max(1, calculatedDistance / dist) : 1;
    calculatedDistance = calculatedDistance * safetyFactor;

    setResult({
      distance: Math.round(calculatedDistance),
      unit: "feet",
      category,
    });
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
      <h3 className="text-lg font-bold text-zinc-100 mb-2">
        Table 19-A Fallout Calculator
      </h3>
      <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-6">
        Calculate minimum safe fallout distances for pyrotechnic displays
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
            Shell Size (inches)
          </label>
          <input
            type="number"
            value={shellSize}
            onChange={(e) => setShellSize(e.target.value)}
            placeholder="e.g., 4"
            step="0.5"
            min="0"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
            Current Distance (feet)
          </label>
          <input
            type="number"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            placeholder="e.g., 300"
            step="10"
            min="0"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={calculateFallout}
        className="w-full rounded-md bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-semibold uppercase tracking-wider text-sm px-6 py-3 transition-all shadow-[0_0_20px_rgba(234,88,12,0.25)]"
      >
        Calculate Fallout Distance
      </button>

      {result && (
        <div className="mt-6 rounded-lg border border-amber-500/30 bg-amber-500/5 p-5">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="text-3xl font-bold text-amber-400">
                {result.distance}
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 mt-1">
                {result.unit}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-zinc-200 mb-1">
                Minimum Safe Distance
              </p>
              <p className="text-xs text-zinc-400">
                Display Category: <span className="text-amber-300">{result.category}</span>
              </p>
              <p className="text-xs text-zinc-500 mt-2">
                This is a simplified calculation. Always refer to official CAL FIRE/OSFM
                guidelines and manufacturer specifications for actual display planning.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}