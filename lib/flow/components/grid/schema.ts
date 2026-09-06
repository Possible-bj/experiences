import { z } from "zod";

export const GridEndActionSchema = z.object({
  key: z.string(),
  params: z.object({ text: z.string().optional() }).optional(),
});

export const GridConfigSchema = z.object({
  cells: z.number().int().min(1).max(500).default(100),
  // 4 fits comfortably-wide filler content (names/words) at a readable size;
  // higher values need a correspondingly wider layout — see GridRenderer.
  columns: z.number().int().min(1).max(20).default(4),
  showCellNumber: z.boolean().default(true),

  fillStrategy: z.enum(["random-names", "random-words", "custom-list", "blank"]).default("random-names"),
  customListItems: z.array(z.string()).optional(),

  // The path a player follows: linkedCells[i]'s displayed label becomes
  // linkedCells[i+1] — tap the current target, it reveals the next one.
  // linkedCells[0] is the starting target; the last entry is the end.
  linkedCells: z
    .array(z.number().int().min(1))
    .min(2)
    .refine((arr) => new Set(arr).size === arr.length, { message: "Linked cells must be unique." }),
  finalCellText: z.string().min(1).max(40).default("You"),

  missBehavior: z.enum(["shake", "message", "none"]).default("shake"),
  missMessage: z.string().max(100).optional(),

  endActions: z.array(GridEndActionSchema).min(1).default([{ key: "advance-step" }]),
});

export type GridConfig = z.infer<typeof GridConfigSchema>;

export const gridDefaultConfig: GridConfig = {
  cells: 100,
  columns: 4,
  showCellNumber: true,
  fillStrategy: "random-names",
  linkedCells: [50, 40, 55, 91, 84, 32, 64, 6, 80, 100],
  finalCellText: "You",
  missBehavior: "shake",
  endActions: [{ key: "advance-step" }],
};
