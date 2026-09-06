import type { DisplayComponentDefinition } from "@/lib/flow/types";
import { TextConfigSchema, textDefaultConfig, type TextConfig } from "@/lib/flow/components/text/schema";
import { TextInspector } from "@/lib/flow/components/text/Inspector";
import { TextRenderer } from "@/lib/flow/components/text/Renderer";

export const textComponentType: DisplayComponentDefinition<TextConfig> = {
  type: "text",
  label: "Text",
  configSchema: TextConfigSchema,
  defaultConfig: textDefaultConfig,
  Inspector: TextInspector,
  Renderer: TextRenderer,
};
