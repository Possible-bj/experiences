"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { computeGridLabels } from "@/lib/flow/components/grid/labels";
import { runEndActions } from "@/lib/flow/strategies/end-action";
import type { GridConfig } from "@/lib/flow/components/grid/schema";
import { useExperienceStyle } from "@/lib/flow/style-context";
import { resolveConfettiColors } from "@/lib/flow/style";

export function GridRenderer({
  config,
  onComplete,
}: {
  config: GridConfig;
  onComplete: () => void;
}) {
  const { style, theme } = useExperienceStyle();
  const labels = useMemo(() => computeGridLabels(config), [config]);
  const finalPosition = config.linkedCells[config.linkedCells.length - 1];

  const [currentTarget, setCurrentTarget] = useState(config.linkedCells[0]);
  const [found, setFound] = useState<number[]>([]);
  const [wrongTap, setWrongTap] = useState<number | null>(null);
  const cellRefs = useRef(new Map<number, HTMLButtonElement>());

  // Guide the player to the next cell instead of leaving them to search the
  // whole grid blind — the target glows before it's tapped, not just after.
  useEffect(() => {
    cellRefs.current.get(currentTarget)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  }, [currentTarget]);

  function handleMiss(position: number) {
    if (config.missBehavior === "shake") {
      setWrongTap(position);
      window.setTimeout(() => setWrongTap((current) => (current === position ? null : current)), 300);
    } else if (config.missBehavior === "message") {
      toast(config.missMessage ?? "Not quite — keep looking.");
    }
  }

  function handleTap(position: number) {
    if (position !== currentTarget) {
      handleMiss(position);
      return;
    }

    setFound((prev) => [...prev, position]);

    if (position === finalPosition) {
      runEndActions(config.endActions, {
        onAdvance: () => window.setTimeout(onComplete, 550),
        triggerConfetti: (colors) => confetti({ colors, particleCount: 150, spread: 90, origin: { y: 0.6 } }),
        showMessage: (text) => toast(text),
        confettiColors: resolveConfettiColors(style),
        defaultText: config.finalCellText,
      });
      return;
    }

    setCurrentTarget(Number(labels[position]));
  }

  return (
    <div className="relative flex w-full flex-col items-center gap-6">
      <p className="font-display relative text-lg italic" style={{ color: theme.mutedText }}>
        find {currentTarget}
      </p>

      {/* overflow-x-auto is the safety net: minmax(84px,...) guarantees every
          column stays wide enough to show filler text, so a high column
          count on a narrow viewport scrolls instead of collapsing to 0.
          Mobile caps at 3 columns regardless of the configured count via
          CSS min() against --cols; sm+ uses the full configured count and
          spreads across the available width instead of being boxed in. */}
      <div className="relative w-full overflow-x-auto">
        <div
          className="grid grid-cols-[repeat(min(var(--cols),3),minmax(84px,1fr))] gap-x-6 gap-y-1.5 sm:[grid-template-columns:repeat(var(--cols),minmax(84px,1fr))]"
          style={{ "--cols": config.columns } as React.CSSProperties}
        >
          {Array.from({ length: config.cells }, (_, i) => i + 1).map((position) => {
            const isFound = found.includes(position);
            const isNextTarget = !isFound && position === currentTarget;
            const isHighlighted = isFound || isNextTarget;
            return (
              <motion.button
                key={position}
                ref={(el) => {
                  if (el) cellRefs.current.set(position, el);
                  else cellRefs.current.delete(position);
                }}
                onClick={() => handleTap(position)}
                whileTap={{ scale: 0.94 }}
                animate={
                  wrongTap === position
                    ? { x: [0, -4, 4, -4, 0] }
                    : isNextTarget
                      ? { scale: [1, 1.06, 1] }
                      : { x: 0 }
                }
                transition={
                  isNextTarget && wrongTap !== position
                    ? { duration: 1.1, repeat: Infinity, ease: "easeInOut" }
                    : { duration: 0.3 }
                }
                className="flex items-baseline gap-1.5 rounded-md px-1.5 py-1 text-left transition-colors"
                style={{
                  backgroundColor: isHighlighted ? theme.tileFoundBg : "transparent",
                  boxShadow: isHighlighted ? `0 0 10px ${theme.accent}80` : "none",
                }}
              >
                {config.showCellNumber && (
                  <span className="w-6 shrink-0 text-right text-xs tabular-nums opacity-50">
                    {position}.
                  </span>
                )}
                <span
                  className="font-display min-w-0 flex-1 truncate text-sm font-medium sm:text-base"
                  style={{ color: isHighlighted ? theme.accent : theme.text }}
                >
                  {labels[position]}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
