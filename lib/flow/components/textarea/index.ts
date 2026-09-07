import type { DisplayComponentDefinition } from "@/lib/flow/types";
import { TextareaConfigSchema, textareaDefaultConfig, type TextareaConfig } from "@/lib/flow/components/textarea/schema";
import { TextareaInspector } from "@/lib/flow/components/textarea/Inspector";
import { TextareaRenderer } from "@/lib/flow/components/textarea/Renderer";

export const textareaComponentType: DisplayComponentDefinition<TextareaConfig> = {
  type: "textarea",
  label: "Textarea",
  configSchema: TextareaConfigSchema,
  defaultConfig: textareaDefaultConfig,
  Inspector: TextareaInspector,
  Renderer: TextareaRenderer,
};
