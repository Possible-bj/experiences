import { MongoClient, type Db } from "mongodb";
import { env } from "@/lib/env";

const DB_NAME = "experiences";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function createClientPromise(): Promise<MongoClient> {
  const client = new MongoClient(env.MONGODB_URI, { ignoreUndefined: true });
  return client.connect();
}

const clientPromise =
  process.env.NODE_ENV === "development"
    ? (global._mongoClientPromise ??= createClientPromise())
    : createClientPromise();

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(DB_NAME);
}
