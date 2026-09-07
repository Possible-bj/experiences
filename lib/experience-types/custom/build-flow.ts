import type { CustomConfig } from "@/lib/experience-types/custom/schema";
import type { ExperienceStyle, FlowEdgeInstance, FlowGraph, FlowNodeInstance } from "@/lib/flow/types";
import { DEFAULT_OUTPUT } from "@/lib/flow/engine";

/**
 * Compiles the Custom type's node list into a FlowGraph. Display/Finale
 * nodes flow to whichever node follows them in the list; a Connector node
 * ignores list order entirely and routes by its own configured targets —
 * including to an earlier node, which is how a creator expresses a
 * "loop back" without any dedicated UI for it.
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
          defaultOutputKey: DEFAULT_OUTPUT,
          cases: node.cases.map((c, j) => ({
            matchType: c.matchType,
            value: c.value,
            min: c.min,
            max: c.max,
            outputKey: `case-${j}`,
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
  config.nodes.forEach((node, i) => {
    if (node.type === "connector") {
      node.cases.forEach((c, j) => {
        edges.push({
          id: `${node.id}-case-${j}`,
          from: { nodeId: node.id, outputKey: `case-${j}` },
          to: c.targetNodeId,
        });
      });
      edges.push({
        id: `${node.id}-default`,
        from: { nodeId: node.id, outputKey: DEFAULT_OUTPUT },
        to: node.defaultTargetNodeId,
      });
    } else if (i < config.nodes.length - 1) {
      edges.push({
        id: `${node.id}-next`,
        from: { nodeId: node.id, outputKey: DEFAULT_OUTPUT },
        to: config.nodes[i + 1].id,
      });
    }
  });

  const flow: FlowGraph = {
    entryNodeId: config.nodes[0].id,
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
