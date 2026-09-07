import { z } from "zod";

export const TextboxConfigSchema = z.object({
  variableName: z.string().min(1),
  prompt: z.string().max(200).optional(),
  placeholder: z.string().max(80).optional(),
  buttonLabel: z.string().max(30).default("Continue"),
});

export type TextboxConfig = z.infer<typeof TextboxConfigSchema>;

export const textboxDefaultConfig: TextboxConfig = {
  variableName: "answer",
  buttonLabel: "Continue",
};
