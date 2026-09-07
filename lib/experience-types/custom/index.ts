import type { ExperienceTypeDefinition } from "@/lib/experience-types/types";
import { CustomConfigSchema, customDefaultConfig, type CustomConfig } from "@/lib/experience-types/custom/schema";
import { CustomCanvasEditor } from "@/components/experiences/custom/canvas/custom-canvas-editor";
import { buildCustomFlow } from "@/lib/experience-types/custom/build-flow";

export const customType: ExperienceTypeDefinition<CustomConfig> = {
  key: "custom",
  label: "Custom",
  category: "custom",
  description:
    "Build your own from scratch — add screens, drop in any component (grid, text, inputs, reveal, calendar...), and branch with connectors.",
  configSchema: CustomConfigSchema,
  defaultConfig: customDefaultConfig,
  ConfigForm: CustomCanvasEditor,
  buildFlow: buildCustomFlow,
};
