import type { CustomNode } from "@/lib/experience-types/custom/schema";

/**
 * One outgoing connection point on a node: a stable per-node handle id
 * (used as both the canvas's React Flow handle id and the compiled flow's
 * Connector outputKey) plus whichever node it currently points at, if any.
 * Shared by the canvas (drawing/updating edges) and `buildCustomFlow`
 * (compiling to real `FlowEdgeInstance`s) so "what does this port connect
 * to" is computed exactly one way.
 */
export interface CustomConnection {
  handle: string;
  targetNodeId: string | undefined;
}

export function getNodeConnections(node: CustomNode): CustomConnection[] {
  if (node.type === "display") {
    return [{ handle: "default", targetNodeId: node.nextNodeId }];
  }
  if (node.type === "connector") {
    return [
      ...node.cases.map((c, i) => ({ handle: `case-${i}`, targetNodeId: c.targetNodeId })),
      { handle: "default", targetNodeId: node.defaultTargetNodeId },
    ];
  }
  return [];
}
