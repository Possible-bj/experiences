import type { NumberChaseConfig } from "@/lib/experience-types/number-chase/schema";
import type { ExperienceStyle, FlowGraph } from "@/lib/flow/types";
import { gridDefaultConfig } from "@/lib/flow/components/grid/schema";

/**
 * Compiles Number Chase's simple flat config into the general flow graph
 * the FlowPlayer runs: Display(intro text) -> Display(grid) -> Finale.
 * This is the only place that knows Number Chase is "really" a 3-node flow.
 */
export function buildNumberChaseFlow(
  config: NumberChaseConfig,
): { flow: FlowGraph; style: ExperienceStyle } {
  const startNumber = config.chain[0];

  const flow: FlowGraph = {
    entryNodeId: "intro",
    nodes: [
      {
        id: "intro",
        type: "display",
        config: {},
        componentInstances: [
          {
            id: "intro-text",
            type: "text",
            config: {
              text: `${config.introPrefix} ${startNumber}`,
              highlightToken: String(startNumber),
            },
          },
        ],
      },
      {
        id: "grid",
        type: "display",
        config: {},
        componentInstances: [
          {
            id: "grid-component",
            type: "grid",
            config: {
              ...gridDefaultConfig,
              linkedCells: config.chain,
              finalCellText: config.finalText,
            },
          },
        ],
      },
      {
        id: "finale",
        type: "finale",
        config: {
          message: config.finaleMessage,
          recipientName: config.recipientName,
        },
      },
    ],
    edges: [
      { id: "intro-to-grid", from: { nodeId: "intro", outputKey: "default" }, to: "grid" },
      { id: "grid-to-finale", from: { nodeId: "grid", outputKey: "default" }, to: "finale" },
    ],
  };

  const style: ExperienceStyle = {
    theme: config.theme,
    backgroundImageUrl: config.backgroundImageUrl,
    confettiColors: config.confettiColors,
  };

  return { flow, style };
}
