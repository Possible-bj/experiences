import type { FlowNodeDefinition } from "@/lib/flow/types";
import { ConnectorConfigSchema, connectorDefaultConfig, type ConnectorConfig } from "@/lib/flow/nodes/connector/schema";
import { ConnectorRenderer } from "@/lib/flow/nodes/connector/Renderer";

export const connectorNodeType: FlowNodeDefinition<ConnectorConfig> = {
  type: "connector",
  label: "Connector",
  isContainer: false,
  configSchema: ConnectorConfigSchema,
  defaultConfig: connectorDefaultConfig,
  Renderer: ConnectorRenderer,
};
