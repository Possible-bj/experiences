import { z } from "zod";

export const LocationInputConfigSchema = z.object({
  variableName: z.string().min(1),
  prompt: z.string().max(200).optional(),
  placeholder: z.string().max(80).default("e.g. Paris, France"),
  buttonLabel: z.string().max(30).default("Continue"),
});

export type LocationInputConfig = z.infer<typeof LocationInputConfigSchema>;

export const locationInputDefaultConfig: LocationInputConfig = {
  variableName: "location",
  placeholder: "e.g. Paris, France",
  buttonLabel: "Continue",
};
