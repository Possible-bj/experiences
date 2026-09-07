import { findUserById } from "@/lib/data/users";
import { countByOwnerAndTypes } from "@/lib/data/experiences";
import { listExperienceTypes } from "@/lib/experience-types/registry";
import type { ExperienceCategory } from "@/lib/experience-types/types";
import { getPlanLimit } from "@/lib/plan-limits";
import type { UserPlan } from "@/lib/schemas/user";

export interface CategoryUsage {
  used: number;
  limit: number;
}

export interface PlanUsage {
  plan: UserPlan;
  system: CategoryUsage;
  custom: CategoryUsage;
}

/**
 * Reads an owner's plan and their current usage in each experience-type
 * category — the single source of truth behind both the plan-limit
 * enforcement in `actions/experiences.ts` and the usage indicators shown in
 * the dashboard/type-picker UI, so the two can never drift apart.
 */
export async function getPlanUsage(ownerId: string): Promise<PlanUsage> {
  const user = await findUserById(ownerId);
  const plan = user?.plan ?? "free";

  async function usageFor(category: ExperienceCategory): Promise<CategoryUsage> {
    const typesInCategory = listExperienceTypes()
      .filter((t) => t.category === category)
      .map((t) => t.key);
    const used = await countByOwnerAndTypes(ownerId, typesInCategory);
    return { used, limit: getPlanLimit(plan, category) };
  }

  const [system, custom] = await Promise.all([usageFor("system"), usageFor("custom")]);
  return { plan, system, custom };
}
