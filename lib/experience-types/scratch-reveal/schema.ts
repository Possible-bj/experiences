import { z } from "zod";
import { EXPERIENCE_THEMES } from "@/lib/flow/style";
import { REVEAL_GESTURES, RevealConfigSchema } from "@/lib/flow/components/reveal/schema";

export const SCRATCH_REVEAL_THEMES = EXPERIENCE_THEMES;
export const SCRATCH_REVEAL_GESTURES = REVEAL_GESTURES;

export const ScratchRevealConfigSchema = z.object({
  gesture: RevealConfigSchema.shape.gesture,
  coveredLabel: RevealConfigSchema.shape.coveredLabel,
  coveredColor: RevealConfigSchema.shape.coveredColor,
  revealThreshold: RevealConfigSchema.shape.revealThreshold,
  revealedText: RevealConfigSchema.shape.revealedText,
  revealedImageUrl: RevealConfigSchema.shape.revealedImageUrl,
  theme: z.enum(EXPERIENCE_THEMES).default("classic"),
  backgroundImageUrl: z.string().url().optional(),
  confettiColors: z.array(z.string()).max(6).optional(),
});

export type ScratchRevealConfig = z.infer<typeof ScratchRevealConfigSchema>;

export const scratchRevealDefaultConfig: ScratchRevealConfig = {
  gesture: "scratch",
  coveredLabel: "Scratch to reveal",
  coveredColor: "#c7c7cc",
  revealThreshold: 40,
  revealedText: "It's a boy!",
  theme: "classic",
};
