"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { LocationInputConfig } from "@/lib/flow/components/location-input/schema";
import { useExperienceStyle } from "@/lib/flow/style-context";
import { useFlowState } from "@/lib/flow/flow-state-context";

/**
 * A free-text place name — deliberately not wired to a maps/geocoding API
 * (that's a real external dependency and cost decision, not something to
 * add silently). Captures "Paris, France" as a plain string; a future
 * version could layer autocomplete on top without changing this contract.
 */
export function LocationInputRenderer({
  config,
  onComplete,
}: {
  config: LocationInputConfig;
  onComplete: () => void;
}) {
  const { theme } = useExperienceStyle();
  const { setVariable } = useFlowState();
  const [value, setValue] = useState("");

  function submit() {
    if (!value.trim()) return;
    setVariable(config.variableName, value.trim());
    onComplete();
  }

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4">
      {config.prompt && (
        <p className="font-display text-2xl italic text-balance">{config.prompt}</p>
      )}
      <div className="relative w-full">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke={theme.mutedText}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2"
        >
          <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
          <circle cx="12" cy="9.5" r="2.4" />
        </svg>
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder={config.placeholder}
          className="w-full rounded-lg border bg-transparent py-3 pr-4 pl-10 text-center text-lg outline-none"
          style={{ borderColor: theme.mutedText, color: theme.text }}
        />
      </div>
      <motion.button
        onClick={submit}
        whileTap={{ scale: 0.95 }}
        disabled={!value.trim()}
        className="rounded-full px-6 py-2 text-sm font-medium disabled:opacity-40"
        style={{ backgroundColor: theme.accent, color: theme.accentText }}
      >
        {config.buttonLabel}
      </motion.button>
    </div>
  );
}
