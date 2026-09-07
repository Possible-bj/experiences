"use client";

import { useEffect, useRef } from "react";
import type { ConnectorConfig } from "@/lib/flow/nodes/connector/schema";
import { useFlowState } from "@/lib/flow/flow-state-context";
import { getConnectorMatchStrategy } from "@/lib/flow/strategies/connector-match";

/**
 * Renders nothing — a Connector is pure routing. It reads one variable,
 * matches it against its configured cases, and advances immediately with
 * whichever outputKey applies. The outgoing edge for that key can point
 * anywhere in the graph, including an earlier node (that's what makes a
 * "loop back" work — it's just an edge, not a different node type).
 */
export function ConnectorRenderer({
  config,
  onAdvance,
}: {
  config: ConnectorConfig;
  onAdvance: (outputKey?: string) => void;
}) {
  const { variables } = useFlowState();
  const hasAdvanced = useRef(false);

  useEffect(() => {
    if (hasAdvanced.current) return;
    hasAdvanced.current = true;

    const value = variables[config.variableName];
    const match = config.cases.find((c) => getConnectorMatchStrategy(c.matchType).matches(value, c));
    onAdvance(match?.outputKey ?? config.defaultOutputKey);
    // Runs once per mount (a fresh mount happens on every visit, including a
    // repeat visit via loop-back) — intentionally not re-run on state churn.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
