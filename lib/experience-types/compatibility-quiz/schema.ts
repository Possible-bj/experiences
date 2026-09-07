import { z } from "zod";
import { EXPERIENCE_THEMES } from "@/lib/flow/style";
import { ScoredQuestionSchema, ScoredResultBandSchema } from "@/lib/experience-types/shared/scored-quiz";

export const COMPATIBILITY_QUIZ_THEMES = EXPERIENCE_THEMES;

// Re-exported under this type's own name so its schema/form files never need
// to know the shared module exists — an implementation detail, not part of
// this type's public shape.
export const CompatibilityQuestionSchema = ScoredQuestionSchema;
export const CompatibilityResultBandSchema = ScoredResultBandSchema;

export const CompatibilityQuizConfigSchema = z.object({
  questions: z.array(CompatibilityQuestionSchema).min(1).max(20),
  recipientName: z.string().max(60).optional(),
  // Sorted ascending by convention; buildFlow doesn't require it (each band
  // becomes its own Connector range case) but the ConfigForm keeps them in
  // order for readability.
  resultBands: z.array(CompatibilityResultBandSchema).min(1).max(6),
  theme: z.enum(EXPERIENCE_THEMES).default("classic"),
  backgroundImageUrl: z.string().url().optional(),
  confettiColors: z.array(z.string()).max(6).optional(),
});

export type CompatibilityQuizConfig = z.infer<typeof CompatibilityQuizConfigSchema>;

export const compatibilityQuizDefaultConfig: CompatibilityQuizConfig = {
  questions: [
    {
      prompt: "Pick a Friday night",
      options: [
        { label: "Home, blankets, a movie", points: 0 },
        { label: "Out dancing until 2am", points: 10 },
      ],
    },
    {
      prompt: "Pineapple on pizza?",
      options: [
        { label: "Absolutely not", points: 0 },
        { label: "Yes, don't judge me", points: 10 },
      ],
    },
    {
      prompt: "Dream vacation",
      options: [
        { label: "Quiet cabin in the mountains", points: 0 },
        { label: "Backpacking through a new country", points: 10 },
      ],
    },
  ],
  resultBands: [
    { minPercent: 0, maxPercent: 33, message: "Opposites attract" },
    { minPercent: 34, maxPercent: 66, message: "A solid match" },
    { minPercent: 67, maxPercent: 100, message: "Practically twins" },
  ],
  theme: "classic",
};
