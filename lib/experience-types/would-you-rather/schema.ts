import { z } from "zod";
import { EXPERIENCE_THEMES } from "@/lib/flow/style";
import { ScoredOptionSchema, ScoredResultBandSchema } from "@/lib/experience-types/shared/scored-quiz";

export const WOULD_YOU_RATHER_THEMES = EXPERIENCE_THEMES;

// Always exactly two options — that's what makes it a "would you rather"
// rather than the open-ended multi-option shape Compatibility Quiz uses.
export const WouldYouRatherQuestionSchema = z.object({
  prompt: z.string().max(120).default("Would you rather..."),
  optionA: ScoredOptionSchema,
  optionB: ScoredOptionSchema,
});

export const WouldYouRatherResultSchema = ScoredResultBandSchema;

export const WouldYouRatherConfigSchema = z.object({
  questions: z.array(WouldYouRatherQuestionSchema).min(1).max(20),
  recipientName: z.string().max(60).optional(),
  results: z.array(WouldYouRatherResultSchema).min(1).max(6),
  theme: z.enum(EXPERIENCE_THEMES).default("classic"),
  backgroundImageUrl: z.string().url().optional(),
  confettiColors: z.array(z.string()).max(6).optional(),
});

export type WouldYouRatherConfig = z.infer<typeof WouldYouRatherConfigSchema>;

export const wouldYouRatherDefaultConfig: WouldYouRatherConfig = {
  questions: [
    {
      prompt: "Would you rather...",
      optionA: { label: "Give up your phone for a month", points: 0 },
      optionB: { label: "Give up coffee for a month", points: 10 },
    },
    {
      prompt: "Would you rather...",
      optionA: { label: "Always be 10 minutes late", points: 0 },
      optionB: { label: "Always be 20 minutes early", points: 10 },
    },
    {
      prompt: "Would you rather...",
      optionA: { label: "Fight one horse-sized duck", points: 0 },
      optionB: { label: "Fight 100 duck-sized horses", points: 10 },
    },
  ],
  results: [
    { minPercent: 0, maxPercent: 33, message: "You're the wild card" },
    { minPercent: 34, maxPercent: 66, message: "Perfectly balanced" },
    { minPercent: 67, maxPercent: 100, message: "The steady one" },
  ],
  theme: "classic",
};
