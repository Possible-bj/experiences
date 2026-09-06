import "server-only";
import { auth } from "@/lib/auth";

/**
 * Defense-in-depth check inside every mutating Server Action — proxy.ts
 * guards page navigation, but mutations re-verify the session themselves
 * rather than trusting the route alone.
 */
export async function requireAuth(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}
