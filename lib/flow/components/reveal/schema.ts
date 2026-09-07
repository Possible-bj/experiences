import { z } from "zod";

export const REVEAL_GESTURES = ["tap", "swipe", "scratch"] as const;

export const RevealConfigSchema = z.object({
  gesture: z.enum(REVEAL_GESTURES).default("tap"),
  coveredLabel: z.string().max(60).default("Tap to reveal"),
  coveredColor: z.string().default("#c7c7cc"),
  // Scratch only: % of the covered area that must be cleared before it
  // auto-completes to a full reveal, rather than requiring pixel-perfect
  // clearing.
  revealThreshold: z.number().int().min(1).max(100).default(40),
  revealedText: z.string().max(200).optional(),
  revealedImageUrl: z.string().url().optional(),
});

export type RevealConfig = z.infer<typeof RevealConfigSchema>;

export const revealDefaultConfig: RevealConfig = {
  gesture: "tap",
  coveredLabel: "Tap to reveal",
  coveredColor: "#c7c7cc",
  revealThreshold: 40,
  revealedText: "Surprise!",
};
