"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { TextareaConfig } from "@/lib/flow/components/textarea/schema";
import { useExperienceStyle } from "@/lib/flow/style-context";
import { useFlowState } from "@/lib/flow/flow-state-context";

export function TextareaRenderer({
  config,
  onComplete,
}: {
  config: TextareaConfig;
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
      <textarea
        autoFocus
        rows={config.rows}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={config.placeholder}
        className="w-full resize-none rounded-lg border bg-transparent px-4 py-3 text-base outline-none"
        style={{ borderColor: theme.mutedText, color: theme.text }}
      />
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
