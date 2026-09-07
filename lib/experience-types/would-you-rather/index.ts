import type { ExperienceTypeDefinition } from "@/lib/experience-types/types";
import {
  WouldYouRatherConfigSchema,
  wouldYouRatherDefaultConfig,
  type WouldYouRatherConfig,
} from "@/lib/experience-types/would-you-rather/schema";
import { WouldYouRatherConfigForm } from "@/components/experiences/would-you-rather/config-form";
import { buildWouldYouRatherFlow } from "@/lib/experience-types/would-you-rather/build-flow";

export const wouldYouRatherType: ExperienceTypeDefinition<WouldYouRatherConfig> = {
  key: "would-you-rather",
  label: "Would You Rather Chain",
  category: "system",
  description:
    "A chain of would-you-rather picks building anticipation to a personalized result — a classic send-to-a-friend format.",
  configSchema: WouldYouRatherConfigSchema,
  defaultConfig: wouldYouRatherDefaultConfig,
  ConfigForm: WouldYouRatherConfigForm,
  buildFlow: buildWouldYouRatherFlow,
};
