import type { WouldYouRatherConfig } from "@/lib/experience-types/would-you-rather/schema";
import type { ExperienceStyle, FlowGraph } from "@/lib/flow/types";
import { buildScoredQuizFlow, type ScoredQuestion } from "@/lib/experience-types/shared/scored-quiz";

const SCORE_VARIABLE = "would-you-rather-score";

/**
 * Compiles Would You Rather Chain's flat config into the general flow
 * graph via the shared scored-quiz builder. The only thing specific to this
 * type is the binary optionA/optionB question shape — it's flattened into
 * the builder's generic `options[]` shape right here, at the boundary.
 */
export function buildWouldYouRatherFlow(
  config: WouldYouRatherConfig,
): { flow: FlowGraph; style: ExperienceStyle } {
  const questions: ScoredQuestion[] = config.questions.map((q) => ({
    prompt: q.prompt,
    options: [q.optionA, q.optionB],
  }));

  const flow = buildScoredQuizFlow({
    questions,
    resultBands: config.results,
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
