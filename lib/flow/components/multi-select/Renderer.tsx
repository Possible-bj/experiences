"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { MultiSelectConfig } from "@/lib/flow/components/multi-select/schema";
import { useExperienceStyle } from "@/lib/flow/style-context";
import { useFlowState } from "@/lib/flow/flow-state-context";

export function MultiSelectRenderer({
  config,
  onComplete,
}: {
  config: MultiSelectConfig;
  onComplete: () => void;
}) {
  const { theme } = useExperienceStyle();
  const { setVariable } = useFlowState();
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(value: string) {
    setSelected((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  }

  function submit() {
    if (selected.length < config.minSelections) return;
    setVariable(config.variableName, selected);
    onComplete();
  }

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4">
      {config.prompt && (
        <p className="font-display text-2xl italic text-balance">{config.prompt}</p>
      )}
      <div className="flex w-full flex-col gap-2">
        {config.options.map((option) => {
          const isSelected = selected.includes(option.value);
          return (
            <motion.button
              key={option.value}
              onClick={() => toggle(option.value)}
              whileTap={{ scale: 0.97 }}
              className="w-full rounded-lg border px-4 py-3 text-left text-base font-medium transition-colors"
              style={{
                borderColor: isSelected ? theme.accent : theme.mutedText,
                backgroundColor: isSelected ? theme.tileFoundBg : "transparent",
                color: isSelected ? theme.accent : theme.text,
              }}
            >
              {option.label}
            </motion.button>
          );
        })}
      </div>
      <motion.button
        onClick={submit}
        whileTap={{ scale: 0.95 }}
        disabled={selected.length < config.minSelections}
        className="rounded-full px-6 py-2 text-sm font-medium disabled:opacity-40"
        style={{ backgroundColor: theme.accent, color: theme.accentText }}
      >
        {config.buttonLabel}
      </motion.button>
    </div>
  );
}
