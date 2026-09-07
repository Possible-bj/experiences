import type { DisplayComponentDefinition } from "@/lib/flow/types";
import { CalendarConfigSchema, calendarDefaultConfig, type CalendarConfig } from "@/lib/flow/components/calendar/schema";
import { CalendarInspector } from "@/lib/flow/components/calendar/Inspector";
import { CalendarRenderer } from "@/lib/flow/components/calendar/Renderer";

export const calendarComponentType: DisplayComponentDefinition<CalendarConfig> = {
  type: "calendar",
  label: "Calendar",
  configSchema: CalendarConfigSchema,
  defaultConfig: calendarDefaultConfig,
  Inspector: CalendarInspector,
  Renderer: CalendarRenderer,
};
