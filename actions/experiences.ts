"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/actions/require-auth";
import { getExperienceType } from "@/lib/experience-types/registry";
import type { ExperienceCategory } from "@/lib/experience-types/types";
import { ExperienceInputSchema } from "@/lib/schemas/experience";
import { createExperience, deleteExperience, getById, incrementShareCount, updateExperience } from "@/lib/data/experiences";
import { getPlanUsage } from "@/lib/plan-usage";
import { encodePersonalizationToken } from "@/lib/personalization-token";
import type { Experience } from "@/lib/schemas/experience";

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

function parseWithType(input: unknown) {
  const universal = ExperienceInputSchema.safeParse(input);
  if (!universal.success) {
    return { ok: false as const, error: "Please check the form and try again." };
  }

  const definition = getExperienceType(universal.data.type);
  if (!definition) {
    return { ok: false as const, error: "Unknown experience type." };
  }

  const config = definition.configSchema.safeParse(universal.data.config);
  if (!config.success) {
    return { ok: false as const, error: "Please check the experience settings and try again." };
  }

  return {
    ok: true as const,
    definition,
    value: { ...universal.data, config: config.data },
  };
}

/**
 * Enforces the owner's plan cap for the category (system/custom) the type
 * being created belongs to — the single choke point for plan limits, since
 * every path that creates a new owned experience (including a future
 * "Copy" action) goes through `createExperienceAction`. Updating an
 * existing experience never calls this — the count doesn't change.
 */
async function checkPlanLimit(
  ownerId: string,
  category: ExperienceCategory,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const usage = await getPlanUsage(ownerId);
  const { used, limit } = usage[category];

  if (used >= limit) {
    const noun = category === "custom" ? "custom experience" : "system-type experience";
    return {
      ok: false,
      error: `You've reached your plan's limit of ${limit} ${noun}${limit === 1 ? "" : "s"}. Upgrade to create more.`,
    };
  }

  return { ok: true };
}

export async function createExperienceAction(
  input: unknown,
): Promise<ActionResult<Experience>> {
  const ownerId = await requireAuth();

  const parsed = parseWithType(input);
  if (!parsed.ok) return { success: false, error: parsed.error };

  const limitCheck = await checkPlanLimit(ownerId, parsed.definition.category);
  if (!limitCheck.ok) return { success: false, error: limitCheck.error };

  const experience = await createExperience(ownerId, parsed.value);
  revalidatePath("/dashboard");

  return { success: true, data: experience };
}

/**
 * Duplicates an experience into the caller's own dashboard as an
 * independent, fully-editable record — distinct from Share, which never
 * creates a new owned record. Copying is allowed for any experience the
 * caller could already reasonably get to: their own (any visibility) or
 * anyone's public one. Delegates to `createExperienceAction` for the actual
 * creation so validation and the plan-limit check never diverge from the
 * normal create path.
 */
export async function copyExperienceAction(id: string): Promise<ActionResult<Experience>> {
  const ownerId = await requireAuth();

  const source = await getById(id);
  if (!source || (source.visibility !== "public" && source.ownerId !== ownerId)) {
    return { success: false, error: "Experience not found." };
  }

  return createExperienceAction({
    type: source.type,
    title: `Copy of ${source.title}`.slice(0, 120),
    visibility: "private",
    config: source.config,
  });
}

export async function updateExperienceAction(
  id: string,
  input: unknown,
): Promise<ActionResult<Experience>> {
  const ownerId = await requireAuth();

  const existing = await getById(id);
  if (!existing || existing.ownerId !== ownerId) {
    return { success: false, error: "Experience not found." };
  }

  const parsed = parseWithType(input);
  if (!parsed.ok) return { success: false, error: parsed.error };

  const updated = await updateExperience(id, ownerId, parsed.value);
  if (!updated) return { success: false, error: "Experience not found." };

  revalidatePath("/dashboard");
  revalidatePath(`/e/${updated.slug}`);

  return { success: true, data: updated };
}

/**
 * Fires once per generated share link — the plain canonical copy and a
 * personalized copy both count, same as `viewCount` already counts every
 * visit rather than deduping by visitor. Only counts when someone other
 * than the owner is doing the sharing: the owner copying their own link
 * from their own dashboard is just retrieving it, not spreading it — same
 * access rule as Copy (their own, any visibility, or anyone's public one),
 * since that's exactly who can already see a Share action in the UI.
 */
export async function recordShareAction(id: string): Promise<ActionResult<null>> {
  const callerId = await requireAuth();

  const existing = await getById(id);
  if (!existing || (existing.visibility !== "public" && existing.ownerId !== callerId)) {
    return { success: false, error: "Experience not found." };
  }

  if (existing.ownerId !== callerId) {
    await incrementShareCount(id);
    revalidatePath("/dashboard");
    revalidatePath("/discover");
  }

  return { success: true, data: null };
}

/**
 * Encryption has to happen server-side (the key never reaches the
 * client) — this is the RPC boundary the Share dialog calls to turn its
 * edited field values into the opaque `?p=` token before copying the link.
 */
export async function encodePersonalizationAction(overrides: Record<string, string>): Promise<string> {
  await requireAuth();
  return encodePersonalizationToken(overrides);
}

export async function deleteExperienceAction(
  id: string,
): Promise<ActionResult<null>> {
  const ownerId = await requireAuth();

  const existing = await getById(id);
  if (!existing || existing.ownerId !== ownerId) {
    return { success: false, error: "Experience not found." };
  }

  await deleteExperience(id, ownerId);
  revalidatePath("/dashboard");

  return { success: true, data: null };
}
