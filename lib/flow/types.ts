import type { ComponentType } from "react";
import type { ZodType } from "zod";
import type { ExperienceStyle } from "@/lib/flow/style";

/**
 * A component placeable inside a Display node — Text, Image, Grid, etc.
 * Every component is a self-contained implementation behind this interface
 * (Open/Closed: new components never require changing DisplayNodeRenderer
 * or any other component).
 */
export interface DisplayComponentDefinition<TConfig = unknown> {
  type: string;
  label: string;
  configSchema: ZodType<TConfig>;
  defaultConfig: TConfig;
  Inspector: ComponentType<{ value: TConfig; onChange: (value: TConfig) => void }>;
  Renderer: ComponentType<{ config: TConfig; onComplete: () => void }>;
}

export interface DisplayComponentInstance {
  id: string;
  type: string;
  config: unknown;
}

/**
 * A node in the flow graph. `isContainer` nodes (Display) hold
 * `componentInstances` and render via the component registry; non-container
 * nodes (Finale) render themselves via their own `Renderer`.
 */
export interface FlowNodeDefinition<TConfig = unknown> {
  type: string;
  label: string;
  isContainer: boolean;
  configSchema: ZodType<TConfig>;
  defaultConfig: TConfig;
  Renderer?: ComponentType<{ config: TConfig }>;
}

export interface FlowNodeInstance {
  id: string;
  type: string;
  config: unknown;
  componentInstances?: DisplayComponentInstance[];
}

export interface FlowEdgeInstance {
  id: string;
  from: { nodeId: string; outputKey: string };
  to: string;
}

export interface FlowGraph {
  nodes: FlowNodeInstance[];
  edges: FlowEdgeInstance[];
  entryNodeId: string;
}

export type { ExperienceStyle };
