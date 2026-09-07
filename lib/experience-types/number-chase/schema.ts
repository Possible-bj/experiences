import { z } from "zod";
import { EXPERIENCE_THEMES } from "@/lib/flow/style";

export const NUMBER_CHASE_THEMES = EXPERIENCE_THEMES;

export const NumberChaseConfigSchema = z.object({
  // The path through the grid: chain[0] is the number said in the intro and
  // where the hunt starts. Each chain[i] position, once found, reveals
  // chain[i+1] as the next number to look for. The last entry's position
  // reveals `finalText` instead of a number, ending the hunt.
  chain: z
    .array(z.number().int().min(1).max(100))
    .min(2)
    .max(100)
    .refine((arr) => new Set(arr).size === arr.length, {
      message: "Linked numbers must be unique.",
    }),
  finalText: z.string().min(1).max(40).default("You"),
  introPrefix: z.string().min(1).max(60).default("I love"),
  recipientName: z.string().max(60).optional(),
  finaleMessage: z.string().min(1).max(300).default("I love you"),
  theme: z.enum(EXPERIENCE_THEMES).default("classic"),
  backgroundImageUrl: z.string().url().optional(),
  confettiColors: z.array(z.string()).max(6).optional(),
});

export type NumberChaseConfig = z.infer<typeof NumberChaseConfigSchema>;

export const numberChaseDefaultConfig: NumberChaseConfig = {
  chain: [50, 40, 55, 91, 84, 32, 64, 6, 80, 100],
  finalText: "You",
  introPrefix: "I love",
  finaleMessage: "I love you",
  theme: "classic",
};
