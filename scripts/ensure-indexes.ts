/**
 * Idempotent index bootstrap: creates the unique/lookup indexes this app
 * relies on (unique user email, unique experience slug, owner/visibility
 * lookups). Safe to re-run any time.
 *
 * Run with: npm run db:indexes
 * Requires .env.local: MONGODB_URI
 *
 * Uses dynamic imports so dotenv.config() below runs before "@/lib/env"
 * validates process.env — a static top-level import would be hoisted
 * ahead of it and always fail.
 */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function main() {
  const { ensureUserIndexes } = await import("@/lib/data/users");
  const { ensureExperienceIndexes } = await import("@/lib/data/experiences");

  await ensureUserIndexes();
  await ensureExperienceIndexes();
  console.log("Indexes ensured.");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
