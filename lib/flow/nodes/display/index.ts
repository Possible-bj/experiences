import type { FlowNodeDefinition } from "@/lib/flow/types";
import { DisplayConfigSchema, displayDefaultConfig, type DisplayConfig } from "@/lib/flow/nodes/display/schema";

export const displayNodeType: FlowNodeDefinition<DisplayConfig> = {
  type: "display",
  label: "Display",
  isContainer: true,
  configSchema: DisplayConfigSchema,
  defaultConfig: displayDefaultConfig,
};
