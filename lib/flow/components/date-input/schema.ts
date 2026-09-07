import { z } from "zod";

export const DateInputConfigSchema = z.object({
  variableName: z.string().min(1),
  prompt: z.string().max(200).optional(),
  // ISO date strings (YYYY-MM-DD) — bound the native date picker's range.
  minDate: z.string().optional(),
  maxDate: z.string().optional(),
  buttonLabel: z.string().max(30).default("Continue"),
});

export type DateInputConfig = z.infer<typeof DateInputConfigSchema>;

export const dateInputDefaultConfig: DateInputConfig = {
  variableName: "date",
  buttonLabel: "Continue",
};
