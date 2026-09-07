"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { derivedFinaleMessage, type FinaleConfig } from "@/lib/flow/nodes/finale/schema";
import { useExperienceStyle } from "@/lib/flow/style-context";
import { resolveBackground, resolveConfettiColors } from "@/lib/flow/style";
import { FloatingHearts } from "@/lib/flow/components/shared/floating-hearts";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045, delayChildren: 0.2 } },
};

const letter = {
  hidden: { opacity: 0, y: 16, scale: 0.8 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

export function FinaleRenderer({ config }: { config: FinaleConfig; onAdvance?: (outputKey?: string) => void }) {
  const { style, theme } = useExperienceStyle();
  const message = derivedFinaleMessage(config);

  useEffect(() => {
    const colors = resolveConfettiColors(style);
    const burst = (particleRatio: number, opts: confetti.Options) =>
      confetti({ ...opts, origin: { y: 0.6 }, colors, particleCount: Math.floor(200 * particleRatio) });

    burst(0.25, { spread: 26, startVelocity: 55 });
    burst(0.2, { spread: 60 });
    burst(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    burst(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    burst(0.1, { spread: 120, startVelocity: 45 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 text-center"
      style={{ background: resolveBackground(style), color: theme.text }}
    >
      {theme.decorative === "hearts" && <FloatingHearts />}

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="font-display flex max-w-2xl flex-wrap justify-center gap-x-3 gap-y-1 italic"
      >
        {message.split(" ").map((word, wordIndex) => (
          <span key={`${word}-${wordIndex}`} className="flex">
            {word.split("").map((char, charIndex) => (
              <motion.span
                key={`${char}-${charIndex}`}
                variants={letter}
                className="text-3xl font-semibold sm:text-5xl"
                style={{ color: theme.accent }}
              >
                {char}
              </motion.span>
            ))}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
