import { z } from "zod";

export const CalendarCellSchema = z.object({
  // ISO date (YYYY-MM-DD) — the cell unlocks at local midnight on this day.
  unlockDate: z.string().min(1),
  label: z.string().max(20).optional(),
  revealedText: z.string().max(200).optional(),
  revealedImageUrl: z.string().url().optional(),
});

export type CalendarCell = z.infer<typeof CalendarCellSchema>;

export const CalendarConfigSchema = z.object({
  columns: z.number().int().min(1).max(10).default(5),
  cells: z.array(CalendarCellSchema).min(1).max(31),
  lockedLabel: z.string().max(40).default("Locked"),
});

export type CalendarConfig = z.infer<typeof CalendarConfigSchema>;

export const calendarDefaultConfig: CalendarConfig = {
  columns: 5,
  lockedLabel: "Locked",
  cells: Array.from({ length: 5 }, (_, i) => ({
    unlockDate: new Date(Date.now() + i * 86_400_000).toISOString().slice(0, 10),
    label: String(i + 1),
    revealedText: `Day ${i + 1} surprise!`,
  })),
};
