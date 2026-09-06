import type { FlowNodeDefinition } from "@/lib/flow/types";
import { displayNodeType } from "@/lib/flow/nodes/display";
import { finaleNodeType } from "@/lib/flow/nodes/finale";

// Wait, Connector, Loop-back, and the Input variants will register here too
// once a flow actually needs branching — their interfaces live in
// lib/flow/types.ts already so adding one is additive, not a rewrite.
/* eslint-disable @typescript-eslint/no-explicit-any */
const FLOW_NODES: Record<string, FlowNodeDefinition<any>> = {
  [displayNodeType.type]: displayNodeType,
  [finaleNodeType.type]: finaleNodeType,
};

export function getFlowNodeType(type: string): FlowNodeDefinition<any> | undefined {
  return FLOW_NODES[type];
}

export function listFlowNodeTypes(): FlowNodeDefinition<any>[] {
  return Object.values(FLOW_NODES);
}
/* eslint-enable @typescript-eslint/no-explicit-any */
