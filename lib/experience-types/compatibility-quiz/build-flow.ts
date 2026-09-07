import type { CompatibilityQuizConfig } from "@/lib/experience-types/compatibility-quiz/schema";
import type { ExperienceStyle, FlowGraph } from "@/lib/flow/types";
import { buildScoredQuizFlow } from "@/lib/experience-types/shared/scored-quiz";

const SCORE_VARIABLE = "compatibility-score";

/**
 * Compiles the Compatibility Quiz's flat config into the general flow
 * graph via the shared scored-quiz builder — this is the only place that
 * knows a Compatibility Quiz is "really" a scored quiz over its own
 * question/theme shape.
 */
export function buildCompatibilityQuizFlow(
  config: CompatibilityQuizConfig,
): { flow: FlowGraph; style: ExperienceStyle } {
  const flow = buildScoredQuizFlow({
    questions: config.questions,
    resultBands: config.resultBands,
    recipientName: config.recipientName,
    scoreVariable: SCORE_VARIABLE,
  });

  const style: ExperienceStyle = {
    theme: config.theme,
    backgroundImageUrl: config.backgroundImageUrl,
    confettiColors: config.confettiColors,
  };

  return { flow, style };
}
