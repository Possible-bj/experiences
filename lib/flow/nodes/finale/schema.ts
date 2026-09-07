import { z } from "zod";

export const FinaleConfigSchema = z.object({
  message: z.string().min(1).max(300).default("I love you"),
  recipientName: z.string().max(60).optional(),
});

export type FinaleConfig = z.infer<typeof FinaleConfigSchema>;

export const finaleDefaultConfig: FinaleConfig = {
  message: "I love you",
};

export function derivedFinaleMessage(config: FinaleConfig): string {
  return config.recipientName ? `${config.message}, ${config.recipientName}!` : `${config.message}!`;
}
