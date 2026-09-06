// Unlike FillStrategy/EndAction, a miss-behavior's "execution" is inherently
// a piece of UI (a shake animation, an inline message) rather than a
// side-effecting action — so this stays a small typed registry of metadata
// for the Inspector's picker, and GridRenderer switches on the key directly.
// Forcing a class with an `execute()` that just returns a flag would be
// ceremony without a real seam to gain from.
export interface MissBehaviorDefinition {
  key: "shake" | "message" | "none";
  label: string;
}

export const MISS_BEHAVIORS: MissBehaviorDefinition[] = [
  { key: "shake", label: "Shake" },
  { key: "message", label: "Show a message" },
  { key: "none", label: "Nothing" },
];
