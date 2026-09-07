import { z } from "zod";

export const CONNECTOR_MATCH_TYPES = ["exact", "range"] as const;

export const ConnectorCaseSchema = z.object({
  matchType: z.enum(CONNECTOR_MATCH_TYPES).default("exact"),
  // Used when matchType is "exact" — compared against the variable's value
  // as a string.
  value: z.string().optional(),
  // Used when matchType is "range" — inclusive numeric bounds, e.g. for a
  // quiz score. Either bound may be omitted for an open-ended range.
  min: z.number().optional(),
  max: z.number().optional(),
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
