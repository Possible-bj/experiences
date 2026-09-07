import { EXPERIENCE_THEMES } from "@/lib/flow/style";

/**
 * Generic "share-link personalization" support: lets an owner flag any text
 * field in their experience's config as overridable via the share URL,
 * without ever touching the saved experience — the override lives only in
 * the link's query string. Works identically for every experience type by
 * walking the compiled config's own JSON shape rather than each type
 * declaring its own personalizable fields, so nothing here special-cases a
 * type by key.
 */

export interface PersonalizableField {
  path: string;
  preview: string;
  // Present only for a fixed-choice field (currently just `theme`, which
  // every experience style shares) so the UI can render a picker instead
  // of a freeform text input.
  options?: readonly string[];
}

// Structural/matching/id keys — overriding these could break the flow
// (a mismatched connector case, a moved node) rather than just personalize
// its text, so they're never offered as candidates. `theme` is handled
// separately below (it's a fixed-choice field, not free text).
const EXCLUDED_KEYS = new Set([
  "id",
  "type",
  "variableName",
  "matchType",
  "targetNodeId",
  "defaultTargetNodeId",
  "entryNodeId",
  "nextNodeId",
  "outputKey",
  "value",
  "min",
  "max",
  "scoreVariable",
  "backgroundImageUrl",
  "confettiColors",
  "position",
]);

function joinPath(prefix: string, key: string | number): string {
  if (typeof key === "number") return `${prefix}[${key}]`;
  return prefix ? `${prefix}.${key}` : key;
}

/** Walks a config's own JSON shape, collecting every eligible string leaf. */
export function listTextFields(config: unknown, prefix = ""): PersonalizableField[] {
  if (Array.isArray(config)) {
    return config.flatMap((item, i) => listTextFields(item, joinPath(prefix, i)));
  }
  if (config && typeof config === "object") {
    return Object.entries(config as Record<string, unknown>).flatMap(([key, value]) => {
      const path = joinPath(prefix, key);
      if (EXCLUDED_KEYS.has(key)) return [];
      if (key === "theme" && typeof value === "string") {
        return [{ path, preview: value, options: EXPERIENCE_THEMES }];
      }
      if (typeof value === "string" && value.trim().length > 0) {
        return [{ path, preview: value }];
      }
      return listTextFields(value, path);
    });
  }
  return [];
}

type PathSegment = { key: string; index?: number };

function parsePath(path: string): PathSegment[] {
  return path.split(".").map((segment) => {
    const match = segment.match(/^([^[]+)(?:\[(\d+)\])?$/);
    if (!match) return { key: segment };
    return { key: match[1], index: match[2] !== undefined ? Number(match[2]) : undefined };
  });
}

export function getAtPath(config: unknown, path: string): unknown {
  let current: unknown = config;
  for (const { key, index } of parsePath(path)) {
    if (current === null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[key];
    if (index !== undefined) {
      if (!Array.isArray(current)) return undefined;
      current = current[index];
    }
  }
  return current;
}

/**
 * Returns a new config with each given path's string value replaced —
 * everything else is left exactly as saved. Paths that don't resolve to an
 * existing string are ignored rather than throwing, since overrides come
 * from untrusted query params.
 */
export function applyOverrides(config: unknown, overrides: Record<string, string>): unknown {
  const next = structuredClone(config);
  for (const [path, override] of Object.entries(overrides)) {
    const segments = parsePath(path);
    let target: unknown = next;
    for (let i = 0; i < segments.length - 1; i++) {
      const { key, index } = segments[i];
      if (target === null || typeof target !== "object") {
        target = undefined;
        break;
      }
      target = (target as Record<string, unknown>)[key];
      if (index !== undefined) {
        target = Array.isArray(target) ? target[index] : undefined;
      }
    }
    if (!target || typeof target !== "object") continue;
    const last = segments[segments.length - 1];
    if (last.index !== undefined) {
      const arr = (target as Record<string, unknown>)[last.key];
      if (Array.isArray(arr) && typeof arr[last.index] === "string") {
        arr[last.index] = override;
      }
      continue;
    }
    if (typeof (target as Record<string, unknown>)[last.key] === "string") {
      (target as Record<string, unknown>)[last.key] = override;
    }
  }
  return next;
}
