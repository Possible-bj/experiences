import { z } from "zod";

export const TextareaConfigSchema = z.object({
  variableName: z.string().min(1),
  prompt: z.string().max(200).optional(),
  placeholder: z.string().max(80).optional(),
  buttonLabel: z.string().max(30).default("Continue"),
  rows: z.number().int().min(2).max(10).default(4),
});

export type TextareaConfig = z.infer<typeof TextareaConfigSchema>;

export const textareaDefaultConfig: TextareaConfig = {
  variableName: "answer",
  buttonLabel: "Continue",
  rows: 4,
};
