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
export interface ExperienceTypeDefinition<TConfig = unknown> {
  key: string;
  label: string;
  description: string;
  configSchema: ZodType<TConfig>;
  defaultConfig: TConfig;
  ConfigForm: ComponentType<{
    value: TConfig;
    onChange: (value: TConfig) => void;
  }>;
  buildFlow: (config: TConfig) => { flow: FlowGraph; style: ExperienceStyle };
}
