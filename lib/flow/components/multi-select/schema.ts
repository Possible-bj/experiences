import { z } from "zod";
import { SelectOptionSchema } from "@/lib/flow/components/single-select/schema";

export const MultiSelectConfigSchema = z.object({
  variableName: z.string().min(1),
  prompt: z.string().max(200).optional(),
  options: z.array(SelectOptionSchema).min(2),
  minSelections: z.number().int().min(0).default(1),
  buttonLabel: z.string().max(30).default("Continue"),
});

export type MultiSelectConfig = z.infer<typeof MultiSelectConfigSchema>;

export const multiSelectDefaultConfig: MultiSelectConfig = {
  variableName: "choices",
  options: [
    { label: "Option A", value: "a" },
    { label: "Option B", value: "b" },
  ],
  minSelections: 1,
  buttonLabel: "Continue",
};
