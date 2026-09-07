import { z } from "zod";
import { EXPERIENCE_THEMES } from "@/lib/flow/style";
import { getDisplayComponentType } from "@/lib/flow/components/registry";

export const CUSTOM_THEMES = EXPERIENCE_THEMES;

/**
 * The Custom experience type's creator-facing model: an ordered list of
 * nodes. Display/Finale nodes always flow to the next node in the list;
 * only a Connector node picks its own target(s), by node id, from anywhere
 * in the list — including an earlier one, which is what makes a "loop
 * back" possible without any special UI for it. This linear-plus-branches
 * shape covers every flow this app's five system types actually use,
 * without needing a 2D canvas to express it.
 */
export const CustomComponentInstanceSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  config: z.unknown(),
});

export type CustomComponentInstance = z.infer<typeof CustomComponentInstanceSchema>;

export const CUSTOM_CONNECTOR_MATCH_TYPES = ["exact", "range"] as const;

export const CustomConnectorCaseSchema = z.object({
  matchType: z.enum(CUSTOM_CONNECTOR_MATCH_TYPES).default("exact"),
  value: z.string().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  targetNodeId: z.string().min(1),
});

export type CustomConnectorCase = z.infer<typeof CustomConnectorCaseSchema>;

export const CustomDisplayNodeSchema = z.object({
  id: z.string().min(1),
  type: z.literal("display"),
  components: z.array(CustomComponentInstanceSchema).min(1),
});

export const CustomConnectorNodeSchema = z.object({
  id: z.string().min(1),
  type: z.literal("connector"),
  variableName: z.string().min(1),
  cases: z.array(CustomConnectorCaseSchema),
  defaultTargetNodeId: z.string().min(1),
});

export const CustomFinaleNodeSchema = z.object({
  id: z.string().min(1),
  type: z.literal("finale"),
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
    nodes: z.array(CustomNodeSchema).min(1),
    theme: z.enum(EXPERIENCE_THEMES).default("classic"),
    backgroundImageUrl: z.string().url().optional(),
    confettiColors: z.array(z.string()).max(6).optional(),
  })
  // Each display node's component instances carry an arbitrary registered
  // `type`, so their `config` shape can't be known statically — validated
  // here instead, against the same component registry the flow engine
  // itself uses, so a malformed component config is rejected the same way
  // a malformed system-type config would be.
  .superRefine((data, ctx) => {
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
  nodes: [
    {
      id: "node-1",
      type: "display",
      components: [{ id: "component-1", type: "text", config: { text: "Welcome!" } }],
    },
    {
      id: "node-2",
      type: "finale",
      message: "The end",
    },
  ],
  theme: "classic",
};
