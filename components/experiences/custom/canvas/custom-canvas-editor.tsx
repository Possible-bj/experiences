"use client";

import { useCallback, useMemo, useState } from "react";
import { ReactFlow, Background, Controls, type Connection, type Edge, type NodeChange, type NodePositionChange } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomFlowNode, type FlowNodeType } from "@/components/experiences/custom/canvas/flow-node";
import { StartNode, type StartNodeType } from "@/components/experiences/custom/canvas/start-node";
import { NodeInspector } from "@/components/experiences/custom/canvas/node-inspector";
import { DisplayNodeEditor } from "@/components/experiences/custom/canvas/display-node-editor";
import { getComponentIcon } from "@/components/experiences/custom/canvas/component-icons";
import { getNodeConnections } from "@/lib/experience-types/custom/connections";
import { getDisplayComponentType } from "@/lib/flow/components/registry";
import { buildCustomFlow } from "@/lib/experience-types/custom/build-flow";
import { CUSTOM_THEMES, type CustomConfig, type CustomDisplayNode, type CustomNode } from "@/lib/experience-types/custom/schema";
import { textDefaultConfig } from "@/lib/flow/components/text/schema";
import { THEME_PRESETS } from "@/lib/flow/style";

const START_NODE_ID = "__start__";
const nodeTypes = { custom: CustomFlowNode, start: StartNode };

const FLOW_RAIL_ICON: Record<CustomNode["type"], React.ReactNode> = {
  display: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="13" rx="2.5" />
      <path d="M7 9h10M7 13h6" />
    </svg>
  ),
  connector: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l10 10-10 10L2 12z" />
      <path d="M9 12h6M12 9l3 3-3 3" />
    </svg>
  ),
  finale: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 21V4" />
      <path d="M5 4h13l-3 4 3 4H5" />
    </svg>
  ),
};

const FLOW_RAIL_ITEMS: { type: CustomNode["type"]; label: string }[] = [
  { type: "display", label: "Display" },
  { type: "connector", label: "Connector" },
  { type: "finale", label: "Finale" },
];

// Quick-add shortcuts: each creates a Display node pre-populated with one
// component of this type — matching the design's "Inputs" rail section,
// and giving real purpose to it rather than duplicating the Flow section.
const INPUT_RAIL_ITEMS: { type: string; label: string }[] = [
  { type: "textbox", label: "Textbox" },
  { type: "textarea", label: "Textarea" },
  { type: "single-select", label: "Single select" },
  { type: "multi-select", label: "Multi select" },
  { type: "date-input", label: "Date" },
  { type: "location-input", label: "Location" },
];

let idCounter = 0;
function createId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${Date.now()}-${idCounter}`;
}

// An edge is a "loop back" when it closes a real cycle — i.e. the target
// can already reach the source by following the flow's existing edges.
// Array/creation order isn't a reliable stand-in for this: a node added
// later can still be an earlier step in the actual flow.
function isLoopBackEdge(config: CustomConfig, sourceId: string, targetId: string): boolean {
  if (sourceId === targetId) return true;
  const visited = new Set<string>();
  const stack = [targetId];
  while (stack.length > 0) {
    const current = stack.pop() as string;
    if (current === sourceId) return true;
    if (visited.has(current)) continue;
    visited.add(current);
    const node = config.nodes.find((n) => n.id === current);
    if (!node) continue;
    getNodeConnections(node).forEach(({ targetNodeId }) => {
      if (targetNodeId) stack.push(targetNodeId);
    });
  }
  return false;
}

/**
 * The freeform 2D canvas that replaces the old list-based Custom builder,
 * rebuilt to match the approved design: a two-section icon rail (Flow +
 * Inputs), a distinct Start node whose own connection sets the entry point,
 * dashed loop-back edges, and Display nodes that drill into their own
 * full-screen editor instead of a side panel — only Connector and Finale
 * use the side inspector, matching the design's own split.
 */
export function CustomCanvasEditor({
  value,
  onChange,
}: {
  value: CustomConfig;
  onChange: (value: CustomConfig) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drillNodeId, setDrillNodeId] = useState<string | null>(null);
  const [railCollapsed, setRailCollapsed] = useState(false);

  const flowNodes: FlowNodeType[] = useMemo(
    () =>
      value.nodes.map((node) => ({
        id: node.id,
        type: "custom",
        position: node.position,
        data: { node, onExpand: node.type === "display" ? () => setDrillNodeId(node.id) : undefined },
        selected: node.id === selectedId,
      })),
    [value.nodes, selectedId],
  );

  const entryNode = value.nodes.find((n) => n.id === value.entryNodeId);
  const startNode: StartNodeType = {
    id: START_NODE_ID,
    type: "start",
    position: entryNode ? { x: entryNode.position.x - 150, y: entryNode.position.y + 18 } : { x: 20, y: 20 },
    data: {},
    draggable: false,
    selectable: false,
  };

  const flowEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [
      { id: `${START_NODE_ID}-edge`, source: START_NODE_ID, sourceHandle: "default", target: value.entryNodeId },
    ];
    value.nodes.forEach((node) => {
      getNodeConnections(node).forEach(({ handle, targetNodeId }) => {
        if (!targetNodeId) return;
        const loopBack = isLoopBackEdge(value, node.id, targetNodeId);
        edges.push({
          id: `${node.id}-${handle}`,
          source: node.id,
          sourceHandle: handle,
          target: targetNodeId,
          ...(loopBack
            ? {
                style: { strokeDasharray: "5 4", stroke: "var(--muted-foreground)" },
                label: "loops back",
                labelStyle: { fill: "var(--muted-foreground)", fontSize: 10 },
                labelBgStyle: { fill: "var(--background)" },
              }
            : {}),
        });
      });
    });
    return edges;
  }, [value]);

  const updateNode = useCallback(
    (id: string, updater: (node: CustomNode) => CustomNode) => {
      onChange({ ...value, nodes: value.nodes.map((n) => (n.id === id ? updater(n) : n)) });
    },
    [value, onChange],
  );

  const handleNodesChange = useCallback(
    (changes: NodeChange<FlowNodeType | StartNodeType>[]) => {
      const moved = changes.filter(
        (c): c is NodePositionChange => c.type === "position" && !!c.position && c.id !== START_NODE_ID,
      );
      if (moved.length === 0) return;
      const nodes = value.nodes.map((node) => {
        const change = moved.find((c) => c.id === node.id);
        return change?.position ? { ...node, position: change.position } : node;
      });
      onChange({ ...value, nodes });
    },
    [value, onChange],
  );

  const handleConnect = useCallback(
    (connection: Connection) => {
      const { source, sourceHandle, target } = connection;
      if (!source || !target) return;
      if (source === START_NODE_ID) {
        onChange({ ...value, entryNodeId: target });
        return;
      }
      updateNode(source, (node) => {
        if (node.type === "display") return { ...node, nextNodeId: target };
        if (node.type === "connector") {
          if (!sourceHandle || sourceHandle === "default") return { ...node, defaultTargetNodeId: target };
          const index = Number(sourceHandle.replace("case-", ""));
          const cases = [...node.cases];
          if (cases[index]) cases[index] = { ...cases[index], targetNodeId: target };
          return { ...node, cases };
        }
        return node;
      });
    },
    [value, onChange, updateNode],
  );

  const handleEdgesDelete = useCallback(
    (edges: Edge[]) => {
      edges.forEach((edge) => {
        if (edge.source === START_NODE_ID) return;
        updateNode(edge.source, (node) => {
          if (node.type === "display") return { ...node, nextNodeId: undefined };
          if (node.type === "connector") {
            if (!edge.sourceHandle || edge.sourceHandle === "default") {
              return { ...node, defaultTargetNodeId: undefined };
            }
            const index = Number(edge.sourceHandle.replace("case-", ""));
            const cases = [...node.cases];
            if (cases[index]) cases[index] = { ...cases[index], targetNodeId: undefined };
            return { ...node, cases };
          }
          return node;
        });
      });
    },
    [updateNode],
  );

  function nextPosition(): { x: number; y: number } {
    return { x: 80 + (value.nodes.length % 5) * 60, y: 60 + (value.nodes.length % 4) * 150 };
  }

  function addFlowNode(type: CustomNode["type"]) {
    const position = nextPosition();
    const id = createId(type);
    const node: CustomNode =
      type === "display"
        ? { id, type: "display", position, components: [{ id: createId("component"), type: "text", config: textDefaultConfig }] }
        : type === "connector"
          ? { id, type: "connector", position, variableName: "", cases: [] }
          : { id, type: "finale", position, message: "The end" };
    onChange({ ...value, nodes: [...value.nodes, node] });
    setSelectedId(id);
  }

  function addInputNode(componentType: string) {
    const definition = getDisplayComponentType(componentType);
    const id = createId("display");
    const node: CustomDisplayNode = {
      id,
      type: "display",
      position: nextPosition(),
      components: [{ id: createId("component"), type: componentType, config: definition?.defaultConfig }],
    };
    onChange({ ...value, nodes: [...value.nodes, node] });
    setDrillNodeId(id);
  }

  function deleteNode(id: string) {
    if (value.nodes.length <= 1) return;
    const nodes = value.nodes
      .filter((n) => n.id !== id)
      .map((n) => {
        if (n.type === "display") return n.nextNodeId === id ? { ...n, nextNodeId: undefined } : n;
        if (n.type === "connector") {
          return {
            ...n,
            defaultTargetNodeId: n.defaultTargetNodeId === id ? undefined : n.defaultTargetNodeId,
            cases: n.cases.map((c) => (c.targetNodeId === id ? { ...c, targetNodeId: undefined } : c)),
          };
        }
        return n;
      });
    const entryNodeId = value.entryNodeId === id ? nodes[0].id : value.entryNodeId;
    onChange({ ...value, nodes, entryNodeId });
    setSelectedId(null);
  }

  const selectedNode = value.nodes.find((n) => n.id === selectedId) ?? null;
  const drillNode = value.nodes.find((n) => n.id === drillNodeId && n.type === "display") as CustomDisplayNode | undefined;
  const { style } = buildCustomFlow(value);
  // Below `md` there's only room for one of {rail+canvas, inspector} —
  // opening the inspector gives it the full width and hides the rail and
  // canvas (which is also where the floating theme picker below lives, so
  // it's never left overlapping the inspector). At `md`+ all three panes
  // still show together, unchanged.
  const showInspector = !!selectedNode && selectedNode.type !== "display";

  return (
    <div className="flex h-full flex-col">
      {/* A freeform node canvas fundamentally needs pointer/trackpad space
          it can't get on a phone — rather than a half-working touch
          rebuild, say so plainly below the width it needs. */}
      <div className="flex items-center gap-2 border-b border-border bg-secondary px-4 py-2 text-xs text-muted-foreground md:hidden">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
        Best used on a larger screen — the canvas needs room to drag and connect nodes.
      </div>
      <div className="flex min-h-0 flex-1">
      {/* Left rail — a real sidebar in the layout, matching the design,
          rather than a floating panel that could sit over canvas nodes.
          Collapsible to reclaim canvas space; fully hidden below `md`
          while the inspector is open (see `showInspector`). */}
      <div
        className={`${showInspector ? "hidden md:flex" : "flex"} ${
          railCollapsed ? "w-11" : "w-[100px]"
        } shrink-0 flex-col overflow-y-auto border-r border-border p-2.5`}
      >
        <div className="mb-2 flex items-center justify-between gap-1">
          {!railCollapsed && (
            <p className="mt-0.5 text-[9.5px] font-semibold tracking-wide text-muted-foreground/70 uppercase">Flow</p>
          )}
          <button
            type="button"
            onClick={() => setRailCollapsed((c) => !c)}
            title={railCollapsed ? "Expand rail" : "Collapse rail"}
            className="ml-auto shrink-0 text-muted-foreground hover:text-foreground"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={railCollapsed ? "" : "rotate-180"}
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
        {!railCollapsed && (
          <>
            <div className="grid grid-cols-2 gap-2">
              {FLOW_RAIL_ITEMS.map((item) => (
                <button
                  key={item.type}
                  type="button"
                  title={item.label}
                  onClick={() => addFlowNode(item.type)}
                  className="flex aspect-square items-center justify-center rounded-[10px] border border-border bg-card text-muted-foreground hover:border-primary hover:text-primary"
                >
                  {FLOW_RAIL_ICON[item.type]}
                </button>
              ))}
            </div>

            <p className="mt-3.5 mb-2 text-[9.5px] font-semibold tracking-wide text-muted-foreground/70 uppercase">Inputs</p>
            <div className="grid grid-cols-2 gap-2">
              {INPUT_RAIL_ITEMS.map((item) => (
                <button
                  key={item.type}
                  type="button"
                  title={item.label}
                  onClick={() => addInputNode(item.type)}
                  className="flex aspect-square items-center justify-center rounded-[10px] border border-border bg-card text-muted-foreground hover:border-primary hover:text-primary"
                >
                  {getComponentIcon(item.type)}
                </button>
              ))}
            </div>
            <p className="mt-3.5 text-[10px] leading-relaxed text-muted-foreground/70">
              Components (Grid, Text, Image...) live inside a Display — open one to add them.
            </p>
          </>
        )}
      </div>

      <div className={`${showInspector ? "hidden md:block" : ""} relative min-w-0 flex-1`}>
        <ReactFlow
          nodeTypes={nodeTypes}
          nodes={[startNode, ...flowNodes]}
          edges={flowEdges}
          onNodesChange={handleNodesChange}
          onConnect={handleConnect}
          onEdgesDelete={handleEdgesDelete}
          onNodeClick={(_, node) => node.id !== START_NODE_ID && setSelectedId(node.id)}
          onPaneClick={() => setSelectedId(null)}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          colorMode="dark"
        >
          <Background gap={20} size={1} />
          <Controls showInteractive={false} />
        </ReactFlow>

        <div className="absolute top-4 right-4 rounded-2xl border border-border bg-card p-1.5 shadow-lg">
          <Select value={value.theme} onValueChange={(v) => v && onChange({ ...value, theme: v as CustomConfig["theme"] })}>
            <SelectTrigger className="h-8 w-36 border-none text-xs shadow-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CUSTOM_THEMES.map((theme) => (
                <SelectItem key={theme} value={theme}>
                  {THEME_PRESETS[theme].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedNode && selectedNode.type !== "display" && (
        <NodeInspector
          node={selectedNode}
          config={value}
          isStart={selectedNode.id === value.entryNodeId}
          onChange={(next) => updateNode(selectedNode.id, () => next)}
          onDelete={() => deleteNode(selectedNode.id)}
          onSetStart={() => onChange({ ...value, entryNodeId: selectedNode.id })}
          onClose={() => setSelectedId(null)}
        />
      )}
      </div>

      {drillNode && (
        <DisplayNodeEditor
          experienceTitle="Custom flow"
          node={drillNode}
          style={style}
          onChange={(next) => updateNode(drillNode.id, () => next)}
          onClose={() => setDrillNodeId(null)}
        />
      )}
    </div>
  );
}
