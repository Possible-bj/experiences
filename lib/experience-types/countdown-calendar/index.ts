import type { ExperienceTypeDefinition } from "@/lib/experience-types/types";
import {
  CountdownCalendarConfigSchema,
  countdownCalendarDefaultConfig,
  type CountdownCalendarConfig,
} from "@/lib/experience-types/countdown-calendar/schema";
import { CountdownCalendarConfigForm } from "@/components/experiences/countdown-calendar/config-form";
import { buildCountdownCalendarFlow } from "@/lib/experience-types/countdown-calendar/build-flow";

export const countdownCalendarType: ExperienceTypeDefinition<CountdownCalendarConfig> = {
  key: "countdown-calendar",
  label: "Countdown Calendar",
  category: "system",
  description:
    "A grid of days that unlock one by one — each reveals its own message, photo, or surprise once its date arrives.",
  configSchema: CountdownCalendarConfigSchema,
  defaultConfig: countdownCalendarDefaultConfig,
  ConfigForm: CountdownCalendarConfigForm,
  buildFlow: buildCountdownCalendarFlow,
};
