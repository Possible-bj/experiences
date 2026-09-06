import { z } from "zod";

// A Display node's own config is intentionally empty for now — everything a
// viewer sees comes from its componentInstances. Reserved for future
// node-level settings (e.g. a per-screen background override).
export const DisplayConfigSchema = z.object({});

export type DisplayConfig = z.infer<typeof DisplayConfigSchema>;

export const displayDefaultConfig: DisplayConfig = {};
