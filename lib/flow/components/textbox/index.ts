import type { DisplayComponentDefinition } from "@/lib/flow/types";
import { TextboxConfigSchema, textboxDefaultConfig, type TextboxConfig } from "@/lib/flow/components/textbox/schema";
import { TextboxInspector } from "@/lib/flow/components/textbox/Inspector";
import { TextboxRenderer } from "@/lib/flow/components/textbox/Renderer";

export const textboxComponentType: DisplayComponentDefinition<TextboxConfig> = {
  type: "textbox",
  label: "Textbox",
  configSchema: TextboxConfigSchema,
  defaultConfig: textboxDefaultConfig,
  Inspector: TextboxInspector,
  Renderer: TextboxRenderer,
};
