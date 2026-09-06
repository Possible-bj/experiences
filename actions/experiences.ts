"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/actions/require-auth";
import { getExperienceType } from "@/lib/experience-types/registry";
import { ExperienceInputSchema } from "@/lib/schemas/experience";
import {
  createExperience,
  deleteExperience,
  getById,
  updateExperience,
} from "@/lib/data/experiences";
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
    value: { ...universal.data, config: config.data },
  };
}

export async function createExperienceAction(
  input: unknown,
): Promise<ActionResult<Experience>> {
  const ownerId = await requireAuth();

  const parsed = parseWithType(input);
  if (!parsed.ok) return { success: false, error: parsed.error };

  const experience = await createExperience(ownerId, parsed.value);
  revalidatePath("/dashboard");

  return { success: true, data: experience };
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
