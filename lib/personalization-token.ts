import "server-only";
import crypto from "crypto";
import { env } from "@/lib/env";

/**
 * A share link's personalization overrides are encrypted rather than put
 * in the URL as plain `?field=value` pairs — the field names and the
 * override text never appear in the link, and the token can't be edited
 * or forged without this server-side key (a bit-flipped ciphertext just
 * fails to decrypt, so a tampered link falls back to the canonical config
 * the same way an invalid override already did).
 *
 * The key is derived from the app's existing auth secret rather than a
 * separate one to configure — a distinct HKDF-style label keeps it from
 * being the literal session-signing key.
 */
const KEY = crypto.createHash("sha256").update(`${env.NEXTAUTH_SECRET}:personalization-v1`).digest();

export function encodePersonalizationToken(overrides: Record<string, string>): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", KEY, iv);
  const plaintext = Buffer.from(JSON.stringify(overrides), "utf8");
  const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, encrypted]).toString("base64url");
}

/** Returns null for anything that doesn't decrypt/parse cleanly — a tampered or stale token is just ignored, never thrown. */
export function decodePersonalizationToken(token: string): Record<string, string> | null {
  try {
    const raw = Buffer.from(token, "base64url");
    const iv = raw.subarray(0, 12);
    const authTag = raw.subarray(12, 28);
    const encrypted = raw.subarray(28);
    const decipher = crypto.createDecipheriv("aes-256-gcm", KEY, iv);
    decipher.setAuthTag(authTag);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    const parsed: unknown = JSON.parse(decrypted.toString("utf8"));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;

    const result: Record<string, string> = {};
    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof value === "string") result[key] = value;
    }
    return result;
  } catch {
    return null;
  }
}
