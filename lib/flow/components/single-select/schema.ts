import { z } from "zod";

export const SelectOptionSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

export const SingleSelectConfigSchema = z.object({
  variableName: z.string().min(1),
  prompt: z.string().max(200).optional(),
  options: z.array(SelectOptionSchema).min(2),
});

export type SingleSelectConfig = z.infer<typeof SingleSelectConfigSchema>;

export const singleSelectDefaultConfig: SingleSelectConfig = {
  variableName: "choice",
  options: [
    { label: "Option A", value: "a" },
    { label: "Option B", value: "b" },
  ],
};
