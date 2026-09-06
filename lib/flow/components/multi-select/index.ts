import type { DisplayComponentDefinition } from "@/lib/flow/types";
import {
  MultiSelectConfigSchema,
  multiSelectDefaultConfig,
  type MultiSelectConfig,
} from "@/lib/flow/components/multi-select/schema";
import { MultiSelectInspector } from "@/lib/flow/components/multi-select/Inspector";
import { MultiSelectRenderer } from "@/lib/flow/components/multi-select/Renderer";

export const multiSelectComponentType: DisplayComponentDefinition<MultiSelectConfig> = {
  type: "multi-select",
  label: "Multi select",
  configSchema: MultiSelectConfigSchema,
  defaultConfig: multiSelectDefaultConfig,
  Inspector: MultiSelectInspector,
  Renderer: MultiSelectRenderer,
};
