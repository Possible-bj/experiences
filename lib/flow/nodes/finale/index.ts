import type { FlowNodeDefinition } from "@/lib/flow/types";
import { FinaleConfigSchema, finaleDefaultConfig, type FinaleConfig } from "@/lib/flow/nodes/finale/schema";
import { FinaleRenderer } from "@/lib/flow/nodes/finale/Renderer";

export const finaleNodeType: FlowNodeDefinition<FinaleConfig> = {
  type: "finale",
  label: "Finale",
  isContainer: false,
  configSchema: FinaleConfigSchema,
  defaultConfig: finaleDefaultConfig,
  Renderer: FinaleRenderer,
};
