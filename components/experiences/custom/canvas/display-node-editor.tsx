"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { getComponentIcon } from "@/components/experiences/custom/canvas/component-icons";
import { getDisplayComponentType, listDisplayComponentTypes } from "@/lib/flow/components/registry";
import { resolveBackground, THEME_PRESETS } from "@/lib/flow/style";
import type { CustomComponentInstance, CustomDisplayNode } from "@/lib/experience-types/custom/schema";
import type { ExperienceStyle } from "@/lib/flow/types";

let idCounter = 0;
function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${Date.now()}-${idCounter}`;
}

function previewText(instance: CustomComponentInstance): string {
  const config = instance.config as Record<string, unknown> | undefined;
  const quoted = typeof config?.text === "string" ? config.text : typeof config?.prompt === "string" ? config.prompt : undefined;
  return quoted ?? getDisplayComponentType(instance.type)?.label ?? instance.type;
}

/**
 * The full-screen "drill into a Display node" editor from the approved
 * design: breadcrumb back into the flow, a component palette on the left,
 * a phone-frame preview of this node's components in the middle, and a
 * full inspector for whichever component is selected on the right — a
 * dedicated space for a screen's content, distinct from the canvas's own
 * routing-focused side panel (which Display nodes no longer use at all).
 */
export function DisplayNodeEditor({
  experienceTitle,
  node,
  style,
  onChange,
  onClose,
}: {
  experienceTitle: string;
  node: CustomDisplayNode;
  style: ExperienceStyle;
  onChange: (node: CustomDisplayNode) => void;
  onClose: () => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(node.components[0]?.id ?? null);
  // Below `md` there's only room for the rail plus one of {frame, inspector}
  // at a time — the design's simultaneous 3-column layout only fits once
  // there's room for it. `md:` classes below ignore this and always show
  // both, matching the desktop-approved layout unchanged.
  const [mobileFocus, setMobileFocus] = useState<"preview" | "inspector">("preview");
  const availableTypes = listDisplayComponentTypes();
  const selected = node.components.find((c) => c.id === selectedId) ?? null;
  const selectedDefinition = selected ? getDisplayComponentType(selected.type) : null;
  const theme = THEME_PRESETS[style.theme];

  function selectComponent(id: string) {
    setSelectedId(id);
    setMobileFocus("inspector");
  }

  function addComponent(type: string) {
    const definition = getDisplayComponentType(type);
    const instance: CustomComponentInstance = { id: nextId("component"), type, config: definition?.defaultConfig };
    onChange({ ...node, components: [...node.components, instance] });
    selectComponent(instance.id);
  }

  function updateComponentConfig(id: string, config: unknown) {
    onChange({ ...node, components: node.components.map((c) => (c.id === id ? { ...c, config } : c)) });
  }

  function removeComponent(id: string) {
    if (node.components.length <= 1) return;
    const components = node.components.filter((c) => c.id !== id);
    onChange({ ...node, components });
    if (selectedId === id) setSelectedId(components[0]?.id ?? null);
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <button type="button" onClick={onClose} className="shrink-0 text-muted-foreground hover:text-foreground">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <span className="shrink-0 text-sm text-muted-foreground">{experienceTitle}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-muted-foreground/50">
            <path d="M9 6l6 6-6 6" />
          </svg>
          <span className="truncate text-sm font-semibold">
            &ldquo;{node.components[0] ? previewText(node.components[0]) : "Empty screen"}&rdquo;
          </span>
          <span className="shrink-0 rounded-full border border-border bg-secondary px-2 py-0.5 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
            Display
          </span>
        </div>
        <Button type="button" onClick={onClose}>
          Save
        </Button>
      </div>

      <div className="flex min-h-0 flex-1">
        <div className="w-[100px] shrink-0 overflow-y-auto border-r border-border p-2.5">
          <p className="mt-0.5 mb-2 text-[9.5px] font-semibold tracking-wide text-muted-foreground/70 uppercase">Components</p>
          <div className="grid grid-cols-2 gap-2">
            {availableTypes.map((t) => (
              <button
                key={t.type}
                type="button"
                title={t.label}
                onClick={() => addComponent(t.type)}
                className="flex aspect-square items-center justify-center rounded-[10px] border border-border bg-card text-muted-foreground hover:border-primary hover:text-primary"
              >
                {getComponentIcon(t.type)}
              </button>
            ))}
          </div>
        </div>

        <div
          className={`${mobileFocus === "inspector" ? "hidden md:flex" : "flex"} flex-1 items-center justify-center overflow-y-auto bg-black/30 p-4 sm:p-8`}
        >
          <div className="w-full max-w-[360px] overflow-hidden rounded-[18px] border border-border shadow-[0_30px_70px_rgba(0,0,0,0.5)]">
            <div className="flex h-9 items-center gap-1.5 border-b border-border bg-card px-3">
              <div className="size-[7px] rounded-full bg-[#e0625b]" />
              <div className="size-[7px] rounded-full bg-[#e0b95b]" />
              <div className="size-[7px] rounded-full bg-[#6bbf7a]" />
            </div>
            <div className="flex h-[560px] flex-col gap-3 overflow-y-auto p-4 sm:h-[640px]" style={{ background: resolveBackground(style), color: theme.text }}>
              {node.components.map((instance) => {
                const definition = getDisplayComponentType(instance.type);
                const isSelected = instance.id === selectedId;
                return (
                  <button
                    key={instance.id}
                    type="button"
                    onClick={() => selectComponent(instance.id)}
                    className={`flex items-center gap-2 rounded-[10px] border-[1.5px] px-3 py-2.5 text-left ${
                      isSelected ? "border-primary bg-primary/10" : "border-dashed border-white/25 bg-black/15"
                    }`}
                  >
                    <span className="shrink-0 opacity-80">{getComponentIcon(instance.type)}</span>
                    <span className="truncate text-xs">
                      {definition?.label ?? instance.type} — &ldquo;{previewText(instance)}&rdquo;
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div
          className={`${mobileFocus === "preview" ? "hidden md:block" : "block"} min-w-0 flex-1 overflow-y-auto border-l border-border p-5 md:w-[340px] md:flex-none`}
        >
          <AnimatePresence mode="wait">
            {selected && selectedDefinition ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.15 }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setMobileFocus("preview")}
                      className="text-muted-foreground hover:text-foreground md:hidden"
                      title="Back to preview"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 6l-6 6 6 6" />
                      </svg>
                    </button>
                    <span className="flex items-center gap-2 text-primary">
                      {getComponentIcon(selected.type)}
                      <span className="text-sm font-semibold text-foreground">{selectedDefinition.label}</span>
                    </span>
                  </div>
                  {node.components.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeComponent(selected.id)}
                      className="text-muted-foreground hover:text-destructive"
                      title="Remove component"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V6" />
                      </svg>
                    </button>
                  )}
                </div>
                <selectedDefinition.Inspector
                  value={selected.config}
                  onChange={(config) => updateComponentConfig(selected.id, config)}
                />
              </motion.div>
            ) : (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm text-muted-foreground"
              >
                Select a component to edit it.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
