import type { DisplayComponentDefinition } from "@/lib/flow/types";
import {
  SingleSelectConfigSchema,
  singleSelectDefaultConfig,
  type SingleSelectConfig,
} from "@/lib/flow/components/single-select/schema";
import { SingleSelectInspector } from "@/lib/flow/components/single-select/Inspector";
import { SingleSelectRenderer } from "@/lib/flow/components/single-select/Renderer";

export const singleSelectComponentType: DisplayComponentDefinition<SingleSelectConfig> = {
  type: "single-select",
  label: "Single select",
  configSchema: SingleSelectConfigSchema,
  defaultConfig: singleSelectDefaultConfig,
  Inspector: SingleSelectInspector,
  Renderer: SingleSelectRenderer,
};
