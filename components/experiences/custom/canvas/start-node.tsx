"use client";

import { Handle, Position, type Node } from "@xyflow/react";

/**
 * A distinct visual node for the flow's entry point, matching the approved
 * design (a separate circular "Start" node feeding the first real step)
 * rather than a badge stamped on whichever node happens to be the entry.
 * Its one source handle IS the mechanism for reassigning `entryNodeId`:
 * dragging a new connection from it onto a different node moves the start.
 */
export type StartNodeType = Node<Record<string, never>, "start">;

export function StartNode() {
  return (
    <div className="flex h-16 w-[110px] items-center gap-2 rounded-[14px] border border-border bg-card px-3 py-2.5 shadow-[0_10px_24px_rgba(0,0,0,0.35)]">
      <div className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-primary">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
          <path d="M6 4l14 8-14 8z" />
        </svg>
      </div>
      <span className="text-[13px] font-semibold">Start</span>
      <Handle type="source" position={Position.Right} id="default" className="!size-2.5 !border-2 !border-primary !bg-card" />
    </div>
  );
}
