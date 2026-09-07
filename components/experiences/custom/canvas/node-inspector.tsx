"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConnectorCaseFields } from "@/components/experiences/custom/canvas/connector-case-fields";
import { findAnswerSources, OUTCOME_COLORS, type AnswerSource } from "@/lib/experience-types/custom/answer-sources";
import type { CustomConfig, CustomConnectorCase, CustomNode } from "@/lib/experience-types/custom/schema";

const CUSTOM_VARIABLE = "__custom__";

function regenerateCasesFromSource(source: AnswerSource, existingCases: CustomConnectorCase[]): CustomConnectorCase[] {
  return source.options.map((option) => {
    const existing = existingCases.find((c) => c.value === option.value);
    return { matchType: "exact", value: option.value, label: option.label, targetNodeId: existing?.targetNodeId };
  });
}

/**
 * The side panel for Connector and Finale nodes — Display nodes no longer
 * land here; opening one drills into its own dedicated full-screen editor
 * instead (matching the approved design's split between "edit routing on
 * the canvas" and "edit a screen's content in its own view").
 */
export function NodeInspector({
  node,
  config,
  isStart,
  onChange,
  onDelete,
  onSetStart,
  onClose,
}: {
  node: Exclude<CustomNode, { type: "display" }>;
  config: CustomConfig;
  isStart: boolean;
  onChange: (node: CustomNode) => void;
  onDelete: () => void;
  onSetStart: () => void;
  onClose: () => void;
}) {
  const answerSources = findAnswerSources(config);
  const linkedSource = node.type === "connector" ? answerSources.find((s) => s.variableName === node.variableName) : undefined;

  return (
    <div className="flex h-full w-full shrink-0 flex-col border-l border-border bg-card md:w-80">
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
        <p className="text-[11.5px] font-semibold tracking-wide text-muted-foreground/80 uppercase">
          {node.type === "connector" ? "Connector" : "Finale"}
        </p>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
        {!isStart && (
          <Button type="button" variant="outline" size="sm" onClick={onSetStart} className="w-full">
            Set as start
          </Button>
        )}

        {node.type === "connector" && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Reads the answer from</Label>
              <Select
                value={linkedSource ? linkedSource.variableName : CUSTOM_VARIABLE}
                onValueChange={(v) => {
                  if (!v || v === CUSTOM_VARIABLE) return;
                  const source = answerSources.find((s) => s.variableName === v);
                  if (!source) return;
                  onChange({ ...node, variableName: source.variableName, cases: regenerateCasesFromSource(source, node.cases) });
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a question" />
                </SelectTrigger>
                <SelectContent>
                  {answerSources.map((s) => (
                    <SelectItem key={s.variableName} value={s.variableName}>
                      {s.prompt}
                    </SelectItem>
                  ))}
                  <SelectItem value={CUSTOM_VARIABLE}>Custom variable…</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {!linkedSource && (
              <div className="space-y-1.5">
                <Label className="text-xs">Variable name</Label>
                <Input
                  value={node.variableName}
                  onChange={(e) => onChange({ ...node, variableName: e.target.value })}
                  placeholder="e.g. score"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs">Outcomes</Label>
              {node.cases.map((c, i) =>
                linkedSource ? (
                  <div key={i} className="flex items-center gap-2 rounded-lg border border-border/60 p-2">
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ background: OUTCOME_COLORS[i % OUTCOME_COLORS.length] }}
                    />
                    <Input
                      className="h-8 flex-1 text-xs"
                      value={c.label ?? c.value ?? ""}
                      onChange={(e) => {
                        const cases = [...node.cases];
                        cases[i] = { ...cases[i], label: e.target.value };
                        onChange({ ...node, cases });
                      }}
                    />
                    <span className="shrink-0 text-[10px] whitespace-nowrap text-muted-foreground">→ forward</span>
                  </div>
                ) : (
                  <ConnectorCaseFields
                    key={i}
                    value={c}
                    onChange={(next) => {
                      const cases = [...node.cases];
                      cases[i] = next;
                      onChange({ ...node, cases });
                    }}
                    onRemove={() => onChange({ ...node, cases: node.cases.filter((_, j) => j !== i) })}
                  />
                ),
              )}
              {!linkedSource && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => onChange({ ...node, cases: [...node.cases, { matchType: "exact" }] })}
                >
                  Add outcome
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-dashed border-border/60 p-2 text-xs text-muted-foreground">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="shrink-0">
                <path d="M3 12a9 9 0 1 0 3-6.7" />
                <path d="M3 3v5h5" />
              </svg>
              <span>Anything else ↩ loops back — drag its dot to send it anywhere, including an earlier step.</span>
            </div>
          </div>
        )}

        {node.type === "finale" && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Message</Label>
              <Textarea
                value={node.message}
                onChange={(e) => onChange({ ...node, message: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Recipient name (optional)</Label>
              <Input
                value={node.recipientName ?? ""}
                onChange={(e) => onChange({ ...node, recipientName: e.target.value || undefined })}
              />
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-border p-4">
        <Button type="button" variant="outline" size="sm" className="w-full text-destructive" onClick={onDelete}>
          Delete step
        </Button>
      </div>
    </div>
  );
}
