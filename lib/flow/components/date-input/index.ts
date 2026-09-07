import type { DisplayComponentDefinition } from "@/lib/flow/types";
import {
  DateInputConfigSchema,
  dateInputDefaultConfig,
  type DateInputConfig,
} from "@/lib/flow/components/date-input/schema";
import { DateInputInspector } from "@/lib/flow/components/date-input/Inspector";
import { DateInputRenderer } from "@/lib/flow/components/date-input/Renderer";

export const dateInputComponentType: DisplayComponentDefinition<DateInputConfig> = {
  type: "date-input",
  label: "Date",
  configSchema: DateInputConfigSchema,
  defaultConfig: dateInputDefaultConfig,
  Inspector: DateInputInspector,
  Renderer: DateInputRenderer,
};
