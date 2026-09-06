import { z } from "zod";

export const ExperienceVisibilitySchema = z.enum(["public", "private"]);
export type ExperienceVisibility = z.infer<typeof ExperienceVisibilitySchema>;

export const ExperienceSchema = z.object({
  _id: z.string(),
  slug: z.string().min(1),
  ownerId: z.string().min(1),
  type: z.string().min(1),
  title: z.string().min(1).max(120),
  visibility: ExperienceVisibilitySchema.default("private"),
  config: z.unknown(),
  viewCount: z.number().int().min(0).default(0),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Experience = z.infer<typeof ExperienceSchema>;

export const ExperienceInputSchema = ExperienceSchema.omit({
  _id: true,
  slug: true,
  ownerId: true,
  viewCount: true,
  createdAt: true,
  updatedAt: true,
});

export type ExperienceInput = z.infer<typeof ExperienceInputSchema>;
