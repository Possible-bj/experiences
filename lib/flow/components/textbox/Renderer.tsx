"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { TextboxConfig } from "@/lib/flow/components/textbox/schema";
import { useExperienceStyle } from "@/lib/flow/style-context";
import { useFlowState } from "@/lib/flow/flow-state-context";

export function TextboxRenderer({
  config,
  onComplete,
}: {
  config: TextboxConfig;
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
      <input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder={config.placeholder}
        className="w-full rounded-lg border bg-transparent px-4 py-3 text-center text-lg outline-none"
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
