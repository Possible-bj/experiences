import type { DisplayComponentDefinition } from "@/lib/flow/types";
import { RevealConfigSchema, revealDefaultConfig, type RevealConfig } from "@/lib/flow/components/reveal/schema";
import { RevealInspector } from "@/lib/flow/components/reveal/Inspector";
import { RevealRenderer } from "@/lib/flow/components/reveal/Renderer";

export const revealComponentType: DisplayComponentDefinition<RevealConfig> = {
  type: "reveal",
  label: "Reveal",
  configSchema: RevealConfigSchema,
  defaultConfig: revealDefaultConfig,
  Inspector: RevealInspector,
  Renderer: RevealRenderer,
};
