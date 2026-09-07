import type { CountdownCalendarConfig } from "@/lib/experience-types/countdown-calendar/schema";
import type { ExperienceStyle, FlowGraph } from "@/lib/flow/types";

/**
 * Compiles Countdown Calendar's flat config into a single Display node
 * holding one Calendar component — there's no chain of steps here (unlike
 * every other system type so far), just one persistent, revisitable screen.
 */
export function buildCountdownCalendarFlow(
  config: CountdownCalendarConfig,
): { flow: FlowGraph; style: ExperienceStyle } {
  const flow: FlowGraph = {
    entryNodeId: "calendar",
    nodes: [
      {
        id: "calendar",
        type: "display",
        config: {},
        componentInstances: [
          {
            id: "calendar-component",
            type: "calendar",
            config: {
              columns: config.columns,
              lockedLabel: config.lockedLabel,
              cells: config.cells,
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
