"use client";

import { motion } from "framer-motion";
import type { SingleSelectConfig } from "@/lib/flow/components/single-select/schema";
import { useExperienceStyle } from "@/lib/flow/style-context";
import { useFlowState } from "@/lib/flow/flow-state-context";

export function SingleSelectRenderer({
  config,
  onComplete,
}: {
  config: SingleSelectConfig;
  onComplete: () => void;
}) {
  const { theme } = useExperienceStyle();
  const { setVariable } = useFlowState();

  function choose(value: string) {
    setVariable(config.variableName, value);
    onComplete();
  }

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4">
      {config.prompt && (
        <p className="font-display text-2xl italic text-balance">{config.prompt}</p>
      )}
      <div className="flex w-full flex-col gap-2">
        {config.options.map((option) => (
          <motion.button
            key={option.value}
            onClick={() => choose(option.value)}
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            className="w-full rounded-lg border px-4 py-3 text-base font-medium"
            style={{ borderColor: theme.mutedText, color: theme.text }}
          >
            {option.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
