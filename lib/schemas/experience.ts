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
  // Dot/bracket-notation paths into `config` (e.g. "recipientName",
  // "nodes[2].message") the owner has chosen to expose as share-link
  // overrides — see lib/personalization.ts. Never touches the saved
  // config itself; overrides live only in the share URL's query string.
  shareableFields: z.array(z.string()).default([]),
  viewCount: z.number().int().min(0).default(0),
  shareCount: z.number().int().min(0).default(0),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Experience = z.infer<typeof ExperienceSchema>;

export const ExperienceInputSchema = ExperienceSchema.omit({
  _id: true,
  slug: true,
  ownerId: true,
  viewCount: true,
  shareCount: true,
  createdAt: true,
  updatedAt: true,
});

export type ExperienceInput = z.infer<typeof ExperienceInputSchema>;
