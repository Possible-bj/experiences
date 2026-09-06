import type { ExperienceTypeDefinition } from "@/lib/experience-types/types";
import {
  NumberChaseConfigSchema,
  numberChaseDefaultConfig,
  type NumberChaseConfig,
} from "@/lib/experience-types/number-chase/schema";
import { NumberChaseConfigForm } from "@/components/experiences/number-chase/config-form";
import { buildNumberChaseFlow } from "@/lib/experience-types/number-chase/build-flow";

export const numberChaseType: ExperienceTypeDefinition<NumberChaseConfig> = {
  key: "number-chase",
  label: "Number Chase",
  description:
    "A hidden trail of linked numbers threaded through a wall of names — follow it to the end for a personalized confetti finale.",
  configSchema: NumberChaseConfigSchema,
  defaultConfig: numberChaseDefaultConfig,
  ConfigForm: NumberChaseConfigForm,
  buildFlow: buildNumberChaseFlow,
};
