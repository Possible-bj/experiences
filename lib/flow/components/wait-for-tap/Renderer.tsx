"use client";

import { motion } from "framer-motion";
import type { WaitForTapConfig } from "@/lib/flow/components/wait-for-tap/schema";
import { useExperienceStyle } from "@/lib/flow/style-context";

/**
 * A full-width invisible tap target with a small hint — for a screen whose
 * other content (an Image, plain Text with no highlightToken) isn't itself
 * interactive but the screen still needs to advance on tap.
 */
export function WaitForTapRenderer({
  config,
  onComplete,
}: {
  config: WaitForTapConfig;
  onComplete: () => void;
}) {
  const { theme } = useExperienceStyle();

  return (
    <motion.button
      onClick={onComplete}
      whileTap={{ scale: 0.98 }}
      className="flex w-full flex-col items-center gap-2 py-4"
    >
      <motion.span
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="text-xs tracking-wide uppercase"
        style={{ color: theme.mutedText }}
      >
        {config.hint}
      </motion.span>
    </motion.button>
  );
}
