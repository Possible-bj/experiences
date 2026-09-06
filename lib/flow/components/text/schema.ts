import { z } from "zod";

export const TextConfigSchema = z.object({
  text: z.string().min(1).max(200),
  // If set and found inside `text`, that substring renders as a glowing,
  // tappable token — tapping it completes this component. General enough
  // for "I love {number}" today and any "tap the highlighted word" screen
  // later, not specific to Number Chase.
  highlightToken: z.string().max(40).optional(),
});

export type TextConfig = z.infer<typeof TextConfigSchema>;

export const textDefaultConfig: TextConfig = {
  text: "Tap to continue",
};
