import type { CustomConfig } from "@/lib/experience-types/custom/schema";
import type { SelectOption } from "@/lib/flow/components/single-select/schema";

/**
 * A single/multi-select component instance found somewhere upstream in the
 * flow, whose `variableName` a Connector can read. Matches the approved
 * design's "Reads the answer from" model: a Connector picks a question, not
 * a raw variable name, and its outcomes come from that question's own
 * options — one color-coded case per option, no manual matching.
 */
export interface AnswerSource {
  variableName: string;
  prompt: string;
  options: SelectOption[];
}

const ANSWER_COMPONENT_TYPES = new Set(["single-select", "multi-select"]);

export function findAnswerSources(config: CustomConfig): AnswerSource[] {
  const sources: AnswerSource[] = [];
  for (const node of config.nodes) {
    if (node.type !== "display") continue;
    for (const instance of node.components) {
      if (!ANSWER_COMPONENT_TYPES.has(instance.type)) continue;
      const raw = instance.config as { variableName?: string; prompt?: string; options?: SelectOption[] } | undefined;
      if (!raw?.variableName || !raw.options) continue;
      sources.push({
        variableName: raw.variableName,
        prompt: raw.prompt || "Untitled question",
        options: raw.options,
      });
    }
  }
  return sources;
}

export const OUTCOME_COLORS = ["#e0625b", "#5b8fe0", "#6bbf7a", "#d9b25b", "#a97fd6", "#5bb8b0"];
