import { nanoid } from "nanoid";
import { getDb } from "@/lib/mongodb";
import { generateSlug } from "@/lib/slug";
import type { Experience, ExperienceInput } from "@/lib/schemas/experience";

const COLLECTION = "experiences";

export async function ensureExperienceIndexes(): Promise<void> {
  const db = await getDb();
  await db.collection(COLLECTION).createIndex({ slug: 1 }, { unique: true });
  await db.collection(COLLECTION).createIndex({ ownerId: 1 });
  await db.collection(COLLECTION).createIndex({ visibility: 1, createdAt: -1 });
}

export async function createExperience(
  ownerId: string,
  input: ExperienceInput,
): Promise<Experience> {
  const db = await getDb();
  const now = new Date();

  // Slugs are short and random; a collision is astronomically unlikely but
  // the unique index means we'd rather retry than 500 on the rare clash.
  for (let attempt = 0; attempt < 5; attempt++) {
    const experience: Experience = {
      _id: nanoid(),
      slug: generateSlug(),
      ownerId,
      type: input.type,
      title: input.title,
      visibility: input.visibility,
      config: input.config,
      viewCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    try {
      await db.collection<Experience>(COLLECTION).insertOne(experience as never);
      return experience;
    } catch (error) {
      const isDuplicateSlug =
        error instanceof Error && "code" in error && (error as { code?: number }).code === 11000;
      if (!isDuplicateSlug) throw error;
    }
  }
  throw new Error("Failed to generate a unique slug");
}

export async function updateExperience(
  id: string,
  ownerId: string,
  input: ExperienceInput,
): Promise<Experience | null> {
  const db = await getDb();
  const result = await db.collection<Experience>(COLLECTION).findOneAndUpdate(
    { _id: id, ownerId } as never,
    {
      $set: {
        type: input.type,
        title: input.title,
        visibility: input.visibility,
        config: input.config,
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" },
  );
  return result ?? null;
}

export async function deleteExperience(id: string, ownerId: string): Promise<boolean> {
  const db = await getDb();
  const result = await db
    .collection<Experience>(COLLECTION)
    .deleteOne({ _id: id, ownerId } as never);
  return result.deletedCount > 0;
}

export async function listByOwner(ownerId: string): Promise<Experience[]> {
  const db = await getDb();
  return db
    .collection<Experience>(COLLECTION)
    .find({ ownerId } as never)
    .sort({ createdAt: -1 })
    .toArray();
}

export async function getById(id: string): Promise<Experience | null> {
  const db = await getDb();
  const doc = await db.collection<Experience>(COLLECTION).findOne({ _id: id } as never);
  return doc ?? null;
}

// No visibility or ownership filter — a private experience is "unlisted",
// not "owner-only". Anyone holding the link can resolve it.
export async function getBySlug(slug: string): Promise<Experience | null> {
  const db = await getDb();
  const doc = await db.collection<Experience>(COLLECTION).findOne({ slug } as never);
  return doc ?? null;
}

export async function listPublic(): Promise<Experience[]> {
  const db = await getDb();
  return db
    .collection<Experience>(COLLECTION)
    .find({ visibility: "public" } as never)
    .sort({ createdAt: -1 })
    .toArray();
}

export async function incrementViewCount(slug: string): Promise<void> {
  const db = await getDb();
  await db
    .collection<Experience>(COLLECTION)
    .updateOne({ slug } as never, { $inc: { viewCount: 1 } });
}
