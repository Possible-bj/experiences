import type { ExperienceTypeDefinition } from "@/lib/experience-types/types";
import {
  CompatibilityQuizConfigSchema,
  compatibilityQuizDefaultConfig,
  type CompatibilityQuizConfig,
} from "@/lib/experience-types/compatibility-quiz/schema";
import { CompatibilityQuizConfigForm } from "@/components/experiences/compatibility-quiz/config-form";
import { buildCompatibilityQuizFlow } from "@/lib/experience-types/compatibility-quiz/build-flow";

export const compatibilityQuizType: ExperienceTypeDefinition<CompatibilityQuizConfig> = {
  key: "compatibility-quiz",
  label: "Compatibility Quiz",
  category: "system",
  description:
    "A short set of either/or questions that scores how compatible you two are, ending in a personalized result.",
  configSchema: CompatibilityQuizConfigSchema,
  defaultConfig: compatibilityQuizDefaultConfig,
  ConfigForm: CompatibilityQuizConfigForm,
  buildFlow: buildCompatibilityQuizFlow,
};
