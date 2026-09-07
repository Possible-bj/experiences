import type { CustomConfig } from "@/lib/experience-types/custom/schema";
import { getNodeConnections } from "@/lib/experience-types/custom/connections";
import type { ExperienceStyle, FlowEdgeInstance, FlowGraph, FlowNodeInstance } from "@/lib/flow/types";

/**
 * Compiles the Custom type's canvas model into a FlowGraph: each node's
 * connections (from `getNodeConnections`, the same helper the canvas UI
 * uses to draw them) become real edges, keyed by the same per-node handle
 * id the Connector node type already uses as its `outputKey`. A port with
 * no drawn connection yet simply produces no edge — the compiled flow is
 * always exactly what's visible on the canvas, nothing implied.
 */
export function buildCustomFlow(config: CustomConfig): { flow: FlowGraph; style: ExperienceStyle } {
  const nodes: FlowNodeInstance[] = config.nodes.map((node) => {
    if (node.type === "display") {
      return {
        id: node.id,
        type: "display",
        config: {},
        componentInstances: node.components.map((c) => ({ id: c.id, type: c.type, config: c.config })),
      };
    }
    if (node.type === "connector") {
      return {
        id: node.id,
        type: "connector",
        config: {
          variableName: node.variableName,
          defaultOutputKey: "default",
          cases: node.cases.map((c, i) => ({
            matchType: c.matchType,
            value: c.value,
            min: c.min,
            max: c.max,
            outputKey: `case-${i}`,
          })),
        },
      };
    }
    return {
      id: node.id,
      type: "finale",
      config: { message: node.message, recipientName: node.recipientName },
    };
  });

  const edges: FlowEdgeInstance[] = [];
  config.nodes.forEach((node) => {
    getNodeConnections(node).forEach(({ handle, targetNodeId }) => {
      if (!targetNodeId) return;
      edges.push({
        id: `${node.id}-${handle}`,
        from: { nodeId: node.id, outputKey: handle },
        to: targetNodeId,
      });
    });
  });

  const flow: FlowGraph = {
    entryNodeId: config.entryNodeId,
    nodes,
    edges,
  };

  const style: ExperienceStyle = {
    theme: config.theme,
    backgroundImageUrl: config.backgroundImageUrl,
    confettiColors: config.confettiColors,
  };

  return { flow, style };
}
