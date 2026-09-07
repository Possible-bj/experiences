"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import type { RevealConfig } from "@/lib/flow/components/reveal/schema";
import { useExperienceStyle } from "@/lib/flow/style-context";

const SWIPE_THRESHOLD = 90;
const REVEAL_TO_ADVANCE_DELAY = 1100;

export function RevealRenderer({
  config,
  onComplete,
}: {
  config: RevealConfig;
  onComplete: () => void;
}) {
  const { theme } = useExperienceStyle();
  const [revealed, setRevealed] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const drawing = useRef(false);
  const strokeCount = useRef(0);

  useEffect(() => {
    if (revealed) {
      const timer = window.setTimeout(onComplete, REVEAL_TO_ADVANCE_DELAY);
      return () => window.clearTimeout(timer);
    }
  }, [revealed, onComplete]);

  // Scratch gesture: draw the cover onto a canvas, erase circles along the
  // pointer path with destination-out compositing (the standard scratch-card
  // technique), and sample a subset of pixels periodically to estimate how
  // much has been cleared.
  useEffect(() => {
    if (config.gesture !== "scratch" || revealed) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function paintCover() {
      const rect = container!.getBoundingClientRect();
      canvas!.width = rect.width;
      canvas!.height = rect.height;
      ctx!.globalCompositeOperation = "source-over";
      ctx!.fillStyle = config.coveredColor;
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);
      ctx!.font = "600 16px system-ui, sans-serif";
      ctx!.fillStyle = "rgba(0,0,0,0.4)";
      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";
      ctx!.fillText(config.coveredLabel, canvas!.width / 2, canvas!.height / 2);
    }
    paintCover();

    function pointerPos(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function erase(x: number, y: number) {
      ctx!.globalCompositeOperation = "destination-out";
      // paintCover() leaves fillStyle at the label's semi-transparent alpha;
      // destination-out erases proportionally to the fill's alpha, so an
      // opaque fill here is required for a clean full erase per stroke.
      ctx!.fillStyle = "#000";
      ctx!.beginPath();
      ctx!.arc(x, y, 24, 0, Math.PI * 2);
      ctx!.fill();
    }

    function estimateCleared(): number {
      const { width, height } = canvas!;
      const data = ctx!.getImageData(0, 0, width, height).data;
      const step = 4 * 7; // sample ~1/7th of pixels for performance
      let sampled = 0;
      let cleared = 0;
      for (let i = 3; i < data.length; i += step) {
        sampled++;
        if (data[i] === 0) cleared++;
      }
      return sampled ? (cleared / sampled) * 100 : 0;
    }

    function handleDown(e: PointerEvent) {
      drawing.current = true;
      const { x, y } = pointerPos(e);
      erase(x, y);
    }
    function handleMove(e: PointerEvent) {
      if (!drawing.current) return;
      const { x, y } = pointerPos(e);
      erase(x, y);
      strokeCount.current += 1;
      if (strokeCount.current % 6 === 0 && estimateCleared() >= config.revealThreshold) {
        setRevealed(true);
      }
    }
    function handleUp() {
      if (!drawing.current) return;
      drawing.current = false;
      if (estimateCleared() >= config.revealThreshold) setRevealed(true);
    }

    canvas.addEventListener("pointerdown", handleDown);
    canvas.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("resize", paintCover);
    return () => {
      canvas.removeEventListener("pointerdown", handleDown);
      canvas.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("resize", paintCover);
    };
  }, [config, revealed]);

  function handleSwipeEnd(_: unknown, info: PanInfo) {
    if (Math.abs(info.offset.x) >= SWIPE_THRESHOLD || Math.abs(info.offset.y) >= SWIPE_THRESHOLD) {
      setRevealed(true);
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/3] w-full max-w-sm overflow-hidden rounded-2xl"
      style={{ boxShadow: `0 0 0 1px ${theme.mutedText}40` }}
    >
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center"
        style={
          config.revealedImageUrl
            ? { backgroundImage: `url(${config.revealedImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
            : { backgroundColor: theme.tileFoundBg }
        }
      >
        {config.revealedText && (
          <p className="font-display text-2xl italic text-balance" style={{ color: theme.accent }}>
            {config.revealedText}
          </p>
        )}
      </div>

      <AnimatePresence>
        {!revealed && (
          <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="absolute inset-0">
            {config.gesture === "tap" && (
              <button
                onClick={() => setRevealed(true)}
                className="flex h-full w-full items-center justify-center text-sm font-medium"
                style={{ backgroundColor: config.coveredColor, color: "rgba(0,0,0,0.55)" }}
              >
                {config.coveredLabel}
              </button>
            )}

            {config.gesture === "swipe" && (
              <motion.div
                drag
                dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
                dragElastic={0.4}
                onDragEnd={handleSwipeEnd}
                className="flex h-full w-full cursor-grab items-center justify-center text-sm font-medium active:cursor-grabbing"
                style={{ backgroundColor: config.coveredColor, color: "rgba(0,0,0,0.55)" }}
              >
                {config.coveredLabel}
              </motion.div>
            )}

            {config.gesture === "scratch" && (
              <canvas ref={canvasRef} className="h-full w-full touch-none" />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
