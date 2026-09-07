import { z } from "zod";
import { EXPERIENCE_THEMES } from "@/lib/flow/style";
import { CalendarCellSchema } from "@/lib/flow/components/calendar/schema";

export const COUNTDOWN_CALENDAR_THEMES = EXPERIENCE_THEMES;

export const CountdownCalendarConfigSchema = z.object({
  columns: z.number().int().min(1).max(10).default(5),
  lockedLabel: z.string().max(40).default("Locked"),
  cells: z.array(CalendarCellSchema).min(1).max(31),
  theme: z.enum(EXPERIENCE_THEMES).default("classic"),
  backgroundImageUrl: z.string().url().optional(),
  confettiColors: z.array(z.string()).max(6).optional(),
});

export type CountdownCalendarConfig = z.infer<typeof CountdownCalendarConfigSchema>;

export const countdownCalendarDefaultConfig: CountdownCalendarConfig = {
  columns: 5,
  lockedLabel: "Locked",
  cells: Array.from({ length: 10 }, (_, i) => ({
    unlockDate: new Date(Date.now() + i * 86_400_000).toISOString().slice(0, 10),
    label: String(i + 1),
    revealedText: `Day ${i + 1} surprise!`,
  })),
  theme: "classic",
};
