import type { DisplayComponentDefinition } from "@/lib/flow/types";
import { GridConfigSchema, gridDefaultConfig, type GridConfig } from "@/lib/flow/components/grid/schema";
import { GridInspector } from "@/lib/flow/components/grid/Inspector";
import { GridRenderer } from "@/lib/flow/components/grid/Renderer";

export const gridComponentType: DisplayComponentDefinition<GridConfig> = {
  type: "grid",
  label: "Grid",
  configSchema: GridConfigSchema,
  defaultConfig: gridDefaultConfig,
  Inspector: GridInspector,
  Renderer: GridRenderer,
};
