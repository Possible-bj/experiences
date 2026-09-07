import type { ComponentType } from "react";
import type { ZodType } from "zod";
import type { ExperienceStyle, FlowGraph } from "@/lib/flow/types";

/**
 * The creator-facing template for a system experience type: a simple flat
 * config form that compiles down into the general flow graph the FlowPlayer
 * actually runs. This is what makes "one screen, one form" possible for
 * casual users while the persisted/played representation stays fully
 * general — no per-type special-casing anywhere below this layer.
 */
export type ExperienceCategory = "system" | "custom";

export interface ExperienceTypeDefinition<TConfig = unknown> {
  key: string;
  label: string;
  description: string;
  // "system" = an admin-curated template (Number Chase, Compatibility Quiz,
  // ...); "custom" = the general flow builder. Plan limits are counted per
  // category (see lib/plan-limits.ts) — this is the single place a type
  // declares which bucket it belongs to, so limit-checking code never has
  // to special-case a type by key.
  category: ExperienceCategory;
  configSchema: ZodType<TConfig>;
  defaultConfig: TConfig;
  ConfigForm: ComponentType<{
    value: TConfig;
    onChange: (value: TConfig) => void;
  }>;
  buildFlow: (config: TConfig) => { flow: FlowGraph; style: ExperienceStyle };
}
