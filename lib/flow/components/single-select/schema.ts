import { z } from "zod";

export const SelectOptionSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  // Added to `scoreVariable` (below) when this option is chosen — lets a
  // sequence of select steps accumulate into a quiz score without any
  // dedicated "scoring" node.
  points: z.number().optional(),
});

export const SingleSelectConfigSchema = z.object({
  variableName: z.string().min(1),
  prompt: z.string().max(200).optional(),
  options: z.array(SelectOptionSchema).min(2),
  scoreVariable: z.string().min(1).optional(),
});

export type SingleSelectConfig = z.infer<typeof SingleSelectConfigSchema>;

export const singleSelectDefaultConfig: SingleSelectConfig = {
  variableName: "choice",
  options: [
    { label: "Option A", value: "a" },
    { label: "Option B", value: "b" },
  ],
};
