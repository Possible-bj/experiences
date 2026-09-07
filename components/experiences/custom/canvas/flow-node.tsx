"use client";

import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import type { CustomNode } from "@/lib/experience-types/custom/schema";
import { getNodeConnections } from "@/lib/experience-types/custom/connections";
import { OUTCOME_COLORS } from "@/lib/experience-types/custom/answer-sources";
import { getDisplayComponentType } from "@/lib/flow/components/registry";

const TYPE_ICON: Record<CustomNode["type"], React.ReactNode> = {
  display: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="13" rx="2.5" />
      <path d="M7 9h10M7 13h6" />
    </svg>
  ),
  connector: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l10 10-10 10L2 12z" />
      <path d="M9 12h6M12 9l3 3-3 3" />
    </svg>
  ),
  finale: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 21V4" />
      <path d="M5 4h13l-3 4 3 4H5" />
    </svg>
  ),
};

// Matches the approved design's uppercase node-type labels exactly
// (Display / Connector / Finale) — not the earlier "Screen"/"Ending" copy.
const TYPE_LABEL: Record<CustomNode["type"], string> = {
  display: "Display",
  connector: "Connector",
  finale: "Finale",
};

/**
 * The quoted content preview shown as a node's title, matching the design's
 * `"Welcome — ready for something fun?"` style rather than a generic
 * "text +1 more" summary — pulled from the first component's own text/
 * prompt field when it has one, falling back to its type label.
 */
function contentPreview(node: CustomNode): string {
  if (node.type === "finale") return node.message;
  if (node.type === "connector") {
    return node.variableName ? `Reads "${node.variableName}"` : "No question selected";
  }
  const first = node.components[0];
  if (!first) return "Empty screen";
  const config = first.config as Record<string, unknown> | undefined;
  const quoted = typeof config?.text === "string" ? config.text : typeof config?.prompt === "string" ? config.prompt : undefined;
  if (quoted) return quoted;
  return getDisplayComponentType(first.type)?.label ?? first.type;
}

export type FlowNodeData = { node: CustomNode; onExpand?: () => void };
export type FlowNodeType = Node<FlowNodeData, "custom">;

export function CustomFlowNode({ data, selected }: NodeProps<FlowNodeType>) {
  const { node, onExpand } = data;
  const outputs = getNodeConnections(node);
  const rowHeight = 26;
  const headerHeight = 44;
  const height = node.type === "connector" ? headerHeight + outputs.length * rowHeight + 14 : 80;

  return (
    <div
      className={`relative rounded-[14px] border bg-card px-3.5 py-2.5 shadow-[0_10px_24px_rgba(0,0,0,0.35)] ${
        selected ? "border-primary shadow-[0_0_0_1px_var(--primary),0_10px_24px_rgba(0,0,0,0.35)]" : "border-border"
      }`}
      style={{ width: 190, minHeight: height }}
    >
      <Handle type="target" position={Position.Left} className="!size-2.5 !border-2 !border-primary !bg-card" />

      {node.type === "display" && onExpand && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onExpand();
          }}
          className="absolute top-2.5 right-2.5 text-muted-foreground hover:text-foreground"
          title="Open this screen"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 3H3v6M15 3h6v6M15 21h6v-6M9 21H3v-6" />
          </svg>
        </button>
      )}

      <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold tracking-wide text-muted-foreground/80 uppercase">
        <span className="text-primary">{TYPE_ICON[node.type]}</span>
        {TYPE_LABEL[node.type]}
      </p>
      <p className="pr-3 text-[13px] leading-snug font-medium text-balance">&ldquo;{contentPreview(node)}&rdquo;</p>

      {node.type !== "connector" && node.type !== "finale" && (
        <Handle type="source" position={Position.Right} id="default" className="!size-2.5 !border-2 !border-primary !bg-card" />
      )}

      {node.type === "connector" &&
        outputs.map((output, i) => {
          const isDefault = output.handle === "default";
          const caseIndex = isDefault ? -1 : Number(output.handle.replace("case-", ""));
          const color = isDefault ? undefined : OUTCOME_COLORS[caseIndex % OUTCOME_COLORS.length];
          const branchCase = caseIndex >= 0 ? node.cases[caseIndex] : undefined;
          const branchLabel = isDefault
            ? "Anything else"
            : (branchCase?.label ?? branchCase?.value ?? (branchCase?.matchType === "range" ? `${branchCase.min ?? ""}–${branchCase.max ?? ""}` : "—"));
          return (
            <div
              key={output.handle}
              className="absolute right-[-8px] flex translate-x-full items-center gap-1.5"
              style={{ top: headerHeight + i * rowHeight }}
            >
              <Handle
                type="source"
                position={Position.Right}
                id={output.handle}
                style={{ position: "static", transform: "none", background: color, borderColor: color }}
                className="!size-2.5 !border-2 !bg-card"
              />
              <span
                className={`max-w-[110px] truncate rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                  isDefault ? "border-dashed border-border text-muted-foreground" : "border-border bg-background"
                }`}
                style={!isDefault ? { color } : undefined}
              >
                {isDefault ? "↩ " : ""}
                {branchLabel}
              </span>
            </div>
          );
        })}
    </div>
  );
}
