import type { ExperienceTypeDefinition } from "@/lib/experience-types/types";
import { numberChaseType } from "@/lib/experience-types/number-chase";
import { compatibilityQuizType } from "@/lib/experience-types/compatibility-quiz";
import { wouldYouRatherType } from "@/lib/experience-types/would-you-rather";
import { countdownCalendarType } from "@/lib/experience-types/countdown-calendar";
import { scratchRevealType } from "@/lib/experience-types/scratch-reveal";
import { customType } from "@/lib/experience-types/custom";

// `any` is deliberate here: the registry erases each type's own config type
// so heterogeneous types can share one map. Every other file only ever sees
// a definition after narrowing by `key`, so the erasure never leaks.
/* eslint-disable @typescript-eslint/no-explicit-any */
const EXPERIENCE_TYPES: Record<string, ExperienceTypeDefinition<any>> = {
  [numberChaseType.key]: numberChaseType,
  [compatibilityQuizType.key]: compatibilityQuizType,
  [wouldYouRatherType.key]: wouldYouRatherType,
  [countdownCalendarType.key]: countdownCalendarType,
  [scratchRevealType.key]: scratchRevealType,
  [customType.key]: customType,
};

export function getExperienceType(key: string): ExperienceTypeDefinition<any> | undefined {
  return EXPERIENCE_TYPES[key];
}

export function listExperienceTypes(): ExperienceTypeDefinition<any>[] {
  return Object.values(EXPERIENCE_TYPES);
}
/* eslint-enable @typescript-eslint/no-explicit-any */
