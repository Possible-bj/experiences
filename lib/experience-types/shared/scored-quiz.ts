import { z } from "zod";
import type { FlowEdgeInstance, FlowGraph, FlowNodeInstance } from "@/lib/flow/types";
import { DEFAULT_OUTPUT } from "@/lib/flow/engine";

/**
 * Shared building block for any system type shaped like "answer a sequence
 * of scored questions, land on one of several result bands" — used by both
 * Compatibility Quiz and Would You Rather Chain. Each type keeps its own
 * schema/ConfigForm (different question shape, different creative framing),
 * but they compile down through this one function so the flow-graph wiring
 * — the actual reusable part — is never duplicated (Open/Closed: a third
 * scored-quiz type would reuse this too, without touching either sibling).
 */
export const ScoredOptionSchema = z.object({
  label: z.string().min(1),
  points: z.number().int().min(0).max(100),
});

export type ScoredOption = z.infer<typeof ScoredOptionSchema>;

export const ScoredQuestionSchema = z.object({
  prompt: z.string().min(1).max(200),
  options: z.array(ScoredOptionSchema).min(2).max(6),
});

export type ScoredQuestion = z.infer<typeof ScoredQuestionSchema>;

export const ScoredResultBandSchema = z.object({
  // Inclusive bounds on the final score as a percentage (0-100) of the
  // maximum possible score. Converted to an absolute score range at build
  // time, since Connector matches the raw accumulated score.
  minPercent: z.number().int().min(0).max(100),
  maxPercent: z.number().int().min(0).max(100),
  message: z.string().min(1).max(120),
});

export type ScoredResultBand = z.infer<typeof ScoredResultBandSchema>;

export function buildScoredQuizFlow(params: {
  questions: ScoredQuestion[];
  resultBands: ScoredResultBand[];
  recipientName?: string;
  scoreVariable: string;
}): FlowGraph {
  const { questions, resultBands, recipientName, scoreVariable } = params;

  const maxScore = questions.reduce(
    (sum, q) => sum + Math.max(...q.options.map((o) => o.points)),
    0,
  );

  const questionNodes: FlowNodeInstance[] = questions.map((question, i) => ({
    id: `question-${i}`,
    type: "display",
    config: {},
    componentInstances: [
      {
        id: `question-${i}-select`,
        type: "single-select",
        config: {
          variableName: `answer-${i}`,
          prompt: question.prompt,
          scoreVariable,
          options: question.options.map((option, j) => ({
            label: option.label,
            value: `option-${j}`,
            points: option.points,
          })),
        },
      },
    ],
  }));

  const routeNode: FlowNodeInstance = {
    id: "route",
    type: "connector",
    config: {
      variableName: scoreVariable,
      defaultOutputKey: "band-0",
      cases: resultBands.map((band, i) => ({
        matchType: "range",
        min: Math.round((band.minPercent / 100) * maxScore),
        max: Math.round((band.maxPercent / 100) * maxScore),
        outputKey: `band-${i}`,
      })),
    },
  };

  const finaleNodes: FlowNodeInstance[] = resultBands.map((band, i) => ({
    id: `band-${i}`,
    type: "finale",
    config: {
      message: band.message,
      recipientName,
    },
  }));

  const edges: FlowEdgeInstance[] = [];
  for (let i = 0; i < questionNodes.length - 1; i++) {
    edges.push({
      id: `${questionNodes[i].id}-to-${questionNodes[i + 1].id}`,
      from: { nodeId: questionNodes[i].id, outputKey: DEFAULT_OUTPUT },
      to: questionNodes[i + 1].id,
    });
  }
  edges.push({
    id: `${questionNodes[questionNodes.length - 1].id}-to-route`,
    from: { nodeId: questionNodes[questionNodes.length - 1].id, outputKey: DEFAULT_OUTPUT },
    to: "route",
  });
  resultBands.forEach((_, i) => {
    edges.push({
      id: `route-to-band-${i}`,
      from: { nodeId: "route", outputKey: `band-${i}` },
      to: `band-${i}`,
    });
  });

  return {
    entryNodeId: questionNodes[0].id,
    nodes: [...questionNodes, routeNode, ...finaleNodes],
    edges,
  };
}
