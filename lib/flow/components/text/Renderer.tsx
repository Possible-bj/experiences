"use client";

import { motion } from "framer-motion";
import type { TextConfig } from "@/lib/flow/components/text/schema";
import { useExperienceStyle } from "@/lib/flow/style-context";

export function TextRenderer({
  config,
  onComplete,
}: {
  config: TextConfig;
  onComplete: () => void;
}) {
  const { theme } = useExperienceStyle();
  const parts = config.highlightToken ? config.text.split(config.highlightToken) : null;
  const hasHighlight = parts && parts.length > 1;

  return (
    <motion.p
      initial={{ y: 12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.15, duration: 0.6 }}
      className="font-display max-w-lg text-4xl font-medium text-balance italic sm:text-6xl"
    >
      {hasHighlight ? (
        <>
          {parts![0]}
          <motion.button
            onClick={onComplete}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            animate={{
              textShadow: [
                `0 0 0px ${theme.accent}`,
                `0 0 22px ${theme.accent}`,
                `0 0 0px ${theme.accent}`,
              ],
            }}
            transition={{ textShadow: { duration: 2.2, repeat: Infinity, ease: "easeInOut" } }}
            className="not-italic underline decoration-2 underline-offset-8"
            style={{ color: theme.accent }}
          >
            {config.highlightToken}
          </motion.button>
          {parts!.slice(1).join(config.highlightToken!)}
        </>
      ) : (
        <button onClick={onComplete} className="not-italic">
          {config.text}
        </button>
      )}
    </motion.p>
  );
}
