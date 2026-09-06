import { customAlphabet } from "nanoid";

// Lowercase alphanumeric only — stays clean and unambiguous when spoken aloud
// or copied into a text message.
const generate = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyz",
  10,
);

export function generateSlug(): string {
  return generate();
}
