"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { FlowEngine } from "@/lib/flow/engine";
import { getFlowNodeType } from "@/lib/flow/nodes/registry";
import { StyleProvider } from "@/lib/flow/style-context";
import { FlowStateProvider } from "@/lib/flow/flow-state-context";
import type { ExperienceStyle, FlowGraph } from "@/lib/flow/types";
import { DisplayNodeRenderer } from "@/components/flow/display-node-renderer";

/**
 * Runs any flow graph, regardless of which node/component types it uses —
 * this component never special-cases an experience type. New node or
 * component types only ever require a registry entry, never a change here.
 */
export function FlowPlayer({ flow, style }: { flow: FlowGraph; style: ExperienceStyle }) {
  const engine = useMemo(() => new FlowEngine(flow), [flow]);
  const [currentNodeId, setCurrentNodeId] = useState(engine.getEntryNodeId());

  function advance(outputKey?: string) {
    const next = engine.getNextNodeId(currentNodeId, outputKey);
    if (next) setCurrentNodeId(next);
  }

  const node = engine.getNode(currentNodeId);
  const definition = getFlowNodeType(node.type);
  if (!definition) return null;

  return (
    <StyleProvider style={style}>
      <FlowStateProvider>
        <AnimatePresence mode="wait">
          {definition.isContainer ? (
            <DisplayNodeRenderer key={currentNodeId} node={node} onComplete={() => advance()} />
          ) : (
            definition.Renderer && (
              <definition.Renderer key={currentNodeId} config={node.config} onAdvance={advance} />
            )
          )}
        </AnimatePresence>
      </FlowStateProvider>
    </StyleProvider>
  );
}
