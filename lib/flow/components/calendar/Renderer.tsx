"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import type { CalendarConfig } from "@/lib/flow/components/calendar/schema";
import { useExperienceStyle } from "@/lib/flow/style-context";
import { resolveConfettiColors } from "@/lib/flow/style";

/**
 * A grid of independently date-gated cells — unlike Grid's linked-chain
 * hunt, cells here have no relationship to each other: each unlocks on its
 * own date and, once unlocked, reveals its own content on tap. Never calls
 * onComplete — this is a browse-and-revisit screen (an advent calendar),
 * not a step in a linear sequence.
 */
export function CalendarRenderer({ config }: { config: CalendarConfig; onComplete: () => void }) {
  const { style, theme } = useExperienceStyle();
  const today = useMemo(() => new Date(), []);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  function isUnlocked(unlockDate: string): boolean {
    return new Date(`${unlockDate}T00:00:00`) <= today;
  }

  function tap(index: number, unlocked: boolean) {
    if (!unlocked || revealed.has(index)) return;
    setRevealed((prev) => new Set(prev).add(index));
    confetti({
      colors: resolveConfettiColors(style),
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });
  }

  return (
    <div className="w-full overflow-x-auto">
      <div
        className="grid grid-cols-[repeat(min(var(--cols),4),minmax(64px,1fr))] gap-2 sm:[grid-template-columns:repeat(var(--cols),minmax(64px,1fr))]"
        style={{ "--cols": config.columns } as React.CSSProperties}
      >
        {config.cells.map((cell, i) => {
          const unlocked = isUnlocked(cell.unlockDate);
          const isRevealed = revealed.has(i);
          return (
            <motion.button
              key={i}
              type="button"
              onClick={() => tap(i, unlocked)}
              whileTap={unlocked && !isRevealed ? { scale: 0.94 } : undefined}
              disabled={!unlocked}
              className="relative flex aspect-square flex-col items-center justify-center gap-1 overflow-hidden rounded-lg p-1 text-center"
              style={{
                backgroundColor: isRevealed ? theme.tileFoundBg : theme.tileBg,
                boxShadow: isRevealed ? `0 0 10px ${theme.accent}80` : "none",
                cursor: unlocked ? "pointer" : "not-allowed",
                opacity: unlocked ? 1 : 0.45,
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isRevealed ? (
                  <motion.div
                    key="revealed"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex h-full w-full flex-col items-center justify-center gap-0.5 p-0.5"
                    style={
                      cell.revealedImageUrl
                        ? { backgroundImage: `url(${cell.revealedImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
                        : undefined
                    }
                  >
                    {cell.revealedText && (
                      <span className="text-[10px] leading-tight font-medium text-balance sm:text-xs" style={{ color: theme.accent }}>
                        {cell.revealedText}
                      </span>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-0.5"
                  >
                    <span className="text-sm font-semibold sm:text-base" style={{ color: theme.text }}>
                      {cell.label ?? i + 1}
                    </span>
                    {!unlocked && (
                      <span className="text-[9px]" style={{ color: theme.mutedText }}>
                        {config.lockedLabel}
                      </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
