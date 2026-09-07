import type { ScratchRevealConfig } from "@/lib/experience-types/scratch-reveal/schema";
import type { ExperienceStyle, FlowGraph } from "@/lib/flow/types";

/**
 * Compiles Scratch & Reveal's flat config into a single Display node
 * holding one Reveal component — like Countdown Calendar, there's no chain
 * here: the reveal itself is the whole moment, not a step toward a Finale.
 */
export function buildScratchRevealFlow(
  config: ScratchRevealConfig,
): { flow: FlowGraph; style: ExperienceStyle } {
  const flow: FlowGraph = {
    entryNodeId: "reveal",
    nodes: [
      {
        id: "reveal",
        type: "display",
        config: {},
        componentInstances: [
          {
            id: "reveal-component",
            type: "reveal",
            config: {
              gesture: config.gesture,
              coveredLabel: config.coveredLabel,
              coveredColor: config.coveredColor,
              revealThreshold: config.revealThreshold,
              revealedText: config.revealedText,
              revealedImageUrl: config.revealedImageUrl,
            },
          },
        ],
      },
    ],
    edges: [],
  };

  const style: ExperienceStyle = {
    theme: config.theme,
    backgroundImageUrl: config.backgroundImageUrl,
    confettiColors: config.confettiColors,
  };

  return { flow, style };
}
