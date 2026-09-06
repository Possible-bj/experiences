import { z } from "zod";

export const WaitForTapConfigSchema = z.object({
  hint: z.string().max(60).default("Tap to continue"),
});

export type WaitForTapConfig = z.infer<typeof WaitForTapConfigSchema>;

export const waitForTapDefaultConfig: WaitForTapConfig = {
  hint: "Tap to continue",
};
