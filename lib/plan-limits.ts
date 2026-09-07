import type { UserPlan } from "@/lib/schemas/user";
import type { ExperienceCategory } from "@/lib/experience-types/types";

export type PlanLimits = Record<ExperienceCategory, number>;

// Free plan's caps are locked in: 4 system-type experiences + 1 custom
// experience. Premium's exact caps haven't been decided — Infinity is a
// deliberate "no cap for now" placeholder, not a number to build pricing
// copy on. Update this when real premium numbers are decided.
export const PLAN_LIMITS: Record<UserPlan, PlanLimits> = {
  free: { system: 4, custom: 1 },
  premium: { system: Infinity, custom: Infinity },
};

export function getPlanLimit(plan: UserPlan, category: ExperienceCategory): number {
  return PLAN_LIMITS[plan][category];
}
