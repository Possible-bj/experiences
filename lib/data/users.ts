import { nanoid } from "nanoid";
import { getDb } from "@/lib/mongodb";
import type { User } from "@/lib/schemas/user";

const COLLECTION = "users";

export async function findUserByEmail(email: string): Promise<User | null> {
  const db = await getDb();
  const doc = await db
    .collection<User>(COLLECTION)
    .findOne({ email: email.toLowerCase() });
  return doc ?? null;
}

export async function findUserById(id: string): Promise<User | null> {
  const db = await getDb();
  const doc = await db.collection<User>(COLLECTION).findOne({ _id: id } as never);
  return doc ?? null;
}

export async function createUser(input: {
  email: string;
  passwordHash: string;
  name?: string;
}): Promise<User> {
  const db = await getDb();
  const now = new Date();
  const user: User = {
    _id: nanoid(),
    email: input.email.toLowerCase(),
    passwordHash: input.passwordHash,
    name: input.name,
    createdAt: now,
    updatedAt: now,
  };
  await db.collection<User>(COLLECTION).insertOne(user as never);
  return user;
}

export async function ensureUserIndexes(): Promise<void> {
  const db = await getDb();
  await db.collection(COLLECTION).createIndex({ email: 1 }, { unique: true });
}
