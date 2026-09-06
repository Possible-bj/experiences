import { z } from "zod";

export const ConnectorCaseSchema = z.object({
  // Compared against the variable's value as a string — good enough for the
  // select/text values components write today; a future typed-comparison
  // system (numbers, ranges) can extend this without touching the engine.
  value: z.string(),
  outputKey: z.string().min(1),
});

export const ConnectorConfigSchema = z.object({
  variableName: z.string().min(1),
  cases: z.array(ConnectorCaseSchema).min(1),
  defaultOutputKey: z.string().min(1),
});

export type ConnectorConfig = z.infer<typeof ConnectorConfigSchema>;

export const connectorDefaultConfig: ConnectorConfig = {
  variableName: "",
  cases: [],
  defaultOutputKey: "default",
};
