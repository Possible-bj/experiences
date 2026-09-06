import type { FlowGraph, FlowNodeInstance } from "@/lib/flow/types";

export const DEFAULT_OUTPUT = "default";

/**
 * Pure traversal logic for a flow graph — no React, no rendering. Any UI
 * layer (FlowPlayer today, a future canvas editor tomorrow) drives itself by
 * calling into this class rather than re-implementing graph walking.
 */
export class FlowEngine {
  constructor(private readonly graph: FlowGraph) {}

  getEntryNodeId(): string {
    return this.graph.entryNodeId;
  }

  getNode(nodeId: string): FlowNodeInstance {
    const node = this.graph.nodes.find((n) => n.id === nodeId);
    if (!node) throw new Error(`Flow node not found: ${nodeId}`);
    return node;
  }

  /** The node reached by following `outputKey` off `nodeId`, or null at a terminal node. */
  getNextNodeId(nodeId: string, outputKey: string = DEFAULT_OUTPUT): string | null {
    const edge = this.graph.edges.find(
      (e) => e.from.nodeId === nodeId && e.from.outputKey === outputKey,
    );
    return edge?.to ?? null;
  }
}
