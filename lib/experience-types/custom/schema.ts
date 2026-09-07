import { z } from "zod";
import { EXPERIENCE_THEMES } from "@/lib/flow/style";
import { getDisplayComponentType } from "@/lib/flow/components/registry";

export const CUSTOM_THEMES = EXPERIENCE_THEMES;

/**
 * The Custom experience type's creator-facing model: a freeform 2D canvas
 * of nodes, each with a `position` for layout and its own explicit
 * outgoing connection(s) — a Display's `nextNodeId`, a Connector's
 * per-case `targetNodeId` and `defaultTargetNodeId`. Nothing is implied by
 * array order (unlike the earlier list-based version of this type): a
 * fresh node has no outgoing connection until the creator draws one on the
 * canvas, and any connection can legally point to an earlier node — that's
 * the entire mechanism behind a "loop back," same as before.
 */
export const CustomComponentInstanceSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  config: z.unknown(),
});

export type CustomComponentInstance = z.infer<typeof CustomComponentInstanceSchema>;

export const CustomPositionSchema = z.object({ x: z.number(), y: z.number() });
export type CustomPosition = z.infer<typeof CustomPositionSchema>;

export const CUSTOM_CONNECTOR_MATCH_TYPES = ["exact", "range"] as const;

export const CustomConnectorCaseSchema = z.object({
  matchType: z.enum(CUSTOM_CONNECTOR_MATCH_TYPES).default("exact"),
  value: z.string().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  // Display-only branch text (e.g. an answer option's human label, "Red").
  // `value`/`min`/`max` stay the actual match against the variable — this
  // is never read for matching, only shown on the canvas and in the
  // inspector so a linked Connector's outcomes read like the source
  // question's own options instead of raw stored values.
  label: z.string().optional(),
  // Undefined until the creator draws a connection from this case's port.
  targetNodeId: z.string().optional(),
});

export type CustomConnectorCase = z.infer<typeof CustomConnectorCaseSchema>;

export const CustomDisplayNodeSchema = z.object({
  id: z.string().min(1),
  type: z.literal("display"),
  position: CustomPositionSchema,
  components: z.array(CustomComponentInstanceSchema).min(1),
  nextNodeId: z.string().optional(),
});

export const CustomConnectorNodeSchema = z.object({
  id: z.string().min(1),
  type: z.literal("connector"),
  position: CustomPositionSchema,
  variableName: z.string().min(1),
  cases: z.array(CustomConnectorCaseSchema),
  defaultTargetNodeId: z.string().optional(),
});

export const CustomFinaleNodeSchema = z.object({
  id: z.string().min(1),
  type: z.literal("finale"),
  position: CustomPositionSchema,
  message: z.string().min(1).max(100),
  recipientName: z.string().max(60).optional(),
});

export const CustomNodeSchema = z.discriminatedUnion("type", [
  CustomDisplayNodeSchema,
  CustomConnectorNodeSchema,
  CustomFinaleNodeSchema,
]);

export type CustomNode = z.infer<typeof CustomNodeSchema>;
export type CustomDisplayNode = z.infer<typeof CustomDisplayNodeSchema>;
export type CustomConnectorNode = z.infer<typeof CustomConnectorNodeSchema>;
export type CustomFinaleNode = z.infer<typeof CustomFinaleNodeSchema>;

export const CustomConfigSchema = z
  .object({
    entryNodeId: z.string().min(1),
    nodes: z.array(CustomNodeSchema).min(1),
    theme: z.enum(EXPERIENCE_THEMES).default("classic"),
    backgroundImageUrl: z.string().url().optional(),
    confettiColors: z.array(z.string()).max(6).optional(),
  })
  .superRefine((data, ctx) => {
    const nodeIds = new Set(data.nodes.map((n) => n.id));

    if (!nodeIds.has(data.entryNodeId)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "The start step must point at a real step.",
        path: ["entryNodeId"],
      });
    }

    // Each display node's component instances carry an arbitrary registered
    // `type`, so their `config` shape can't be known statically — validated
    // here instead, against the same component registry the flow engine
    // itself uses, so a malformed component config is rejected the same way
    // a malformed system-type config would be.
    data.nodes.forEach((node, i) => {
      if (node.type !== "display") return;
      node.components.forEach((instance, j) => {
        const definition = getDisplayComponentType(instance.type);
        if (!definition) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Unknown component type: ${instance.type}`,
            path: ["nodes", i, "components", j, "type"],
          });
          return;
        }
        const result = definition.configSchema.safeParse(instance.config);
        if (!result.success) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Invalid settings for ${definition.label}`,
            path: ["nodes", i, "components", j, "config"],
          });
        }
      });
    });
  });

export type CustomConfig = z.infer<typeof CustomConfigSchema>;

export const customDefaultConfig: CustomConfig = {
  entryNodeId: "node-1",
  nodes: [
    {
      id: "node-1",
      type: "display",
      position: { x: 60, y: 200 },
      components: [{ id: "component-1", type: "text", config: { text: "Welcome!" } }],
      nextNodeId: "node-2",
    },
    {
      id: "node-2",
      type: "finale",
      position: { x: 420, y: 200 },
      message: "The end",
    },
  ],
  theme: "classic",
};
