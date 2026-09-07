import type { FlowNodeDefinition } from "@/lib/flow/types";
import { displayNodeType } from "@/lib/flow/nodes/display";
import { finaleNodeType } from "@/lib/flow/nodes/finale";
import { connectorNodeType } from "@/lib/flow/nodes/connector";

// "Wait for tap" and the Input variants (Textbox, Single select, ...) live
// in lib/flow/components/ instead — they render a screen, so they're
// Display-node contents, not their own flow-node type. A "loop back" is
// just a Connector edge whose target is an earlier node, not a distinct
// node type either — the graph model already supports that natively.
/* eslint-disable @typescript-eslint/no-explicit-any */
const FLOW_NODES: Record<string, FlowNodeDefinition<any>> = {
  [displayNodeType.type]: displayNodeType,
  [finaleNodeType.type]: finaleNodeType,
  [connectorNodeType.type]: connectorNodeType,
};

export function getFlowNodeType(type: string): FlowNodeDefinition<any> | undefined {
  return FLOW_NODES[type];
}

export function listFlowNodeTypes(): FlowNodeDefinition<any>[] {
  return Object.values(FLOW_NODES);
}
/* eslint-enable @typescript-eslint/no-explicit-any */
