"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ComponentInstanceEditor } from "@/components/experiences/custom/component-instance-editor";
import { ConnectorCaseEditor } from "@/components/experiences/custom/connector-case-editor";
import type { CustomNode } from "@/lib/experience-types/custom/schema";
import { textDefaultConfig } from "@/lib/flow/components/text/schema";

const NODE_TYPE_LABELS: Record<CustomNode["type"], string> = {
  display: "Screen",
  connector: "Connector (branch)",
  finale: "Ending",
};

function createId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function defaultNodeOfType(type: CustomNode["type"], firstOtherNodeId?: string): CustomNode {
  if (type === "display") {
    return {
      id: createId(),
      type: "display",
      components: [{ id: createId(), type: "text", config: textDefaultConfig }],
    };
  }
  if (type === "connector") {
    return {
      id: createId(),
      type: "connector",
      variableName: "",
      cases: [],
      defaultTargetNodeId: firstOtherNodeId ?? "",
    };
  }
  return { id: createId(), type: "finale", message: "The end" };
}

export function NodeEditor({
  value,
  targetOptions,
  canMoveUp,
  canMoveDown,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  value: CustomNode;
  targetOptions: { id: string; label: string }[];
  canMoveUp: boolean;
  canMoveDown: boolean;
  onChange: (value: CustomNode) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  function handleTypeChange(nextType: string | null) {
    if (!nextType || nextType === value.type) return;
    onChange(defaultNodeOfType(nextType as CustomNode["type"], targetOptions[0]?.id));
  }

  return (
    <div className="space-y-3 rounded-xl border border-border/60 bg-muted/20 p-4">
      <div className="flex items-center gap-2">
        <Select value={value.type} onValueChange={handleTypeChange}>
          <SelectTrigger className="flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(NODE_TYPE_LABELS) as CustomNode["type"][]).map((t) => (
              <SelectItem key={t} value={t}>
                {NODE_TYPE_LABELS[t]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="button" variant="ghost" size="sm" onClick={onMoveUp} disabled={!canMoveUp}>
          Up
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onMoveDown} disabled={!canMoveDown}>
          Down
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
          Remove step
        </Button>
      </div>

      {value.type === "display" && (
        <div className="space-y-2 pl-2">
          <Label>Components (shown in order)</Label>
          {value.components.map((component, i) => (
            <ComponentInstanceEditor
              key={component.id}
              value={component}
              onChange={(next) =>
                onChange({ ...value, components: value.components.map((c, j) => (j === i ? next : c)) })
              }
              onRemove={() => onChange({ ...value, components: value.components.filter((_, j) => j !== i) })}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              onChange({
                ...value,
                components: [...value.components, { id: createId(), type: "text", config: textDefaultConfig }],
              })
            }
          >
            Add component
          </Button>
        </div>
      )}

      {value.type === "connector" && (
        <div className="space-y-3 pl-2">
          <div className="space-y-2">
            <Label htmlFor={`${value.id}-variable`}>Variable to check</Label>
            <Input
              id={`${value.id}-variable`}
              value={value.variableName}
              onChange={(e) => onChange({ ...value, variableName: e.target.value })}
              placeholder="e.g. score or choice"
            />
          </div>

          <Label>Rules (checked in order, first match wins)</Label>
          {value.cases.map((c, i) => (
            <ConnectorCaseEditor
              key={i}
              value={c}
              targetOptions={targetOptions}
              onChange={(next) => onChange({ ...value, cases: value.cases.map((existing, j) => (j === i ? next : existing)) })}
              onRemove={() => onChange({ ...value, cases: value.cases.filter((_, j) => j !== i) })}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              onChange({
                ...value,
                cases: [
                  ...value.cases,
                  { matchType: "exact", value: "", targetNodeId: targetOptions[0]?.id ?? "" },
                ],
              })
            }
          >
            Add rule
          </Button>

          <div className="space-y-2">
            <Label htmlFor={`${value.id}-default`}>Otherwise, go to</Label>
            <Select
              value={value.defaultTargetNodeId}
              onValueChange={(v) => v && onChange({ ...value, defaultTargetNodeId: v })}
            >
              <SelectTrigger id={`${value.id}-default`}>
                <SelectValue placeholder="Choose a step" />
              </SelectTrigger>
              <SelectContent>
                {targetOptions.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {value.type === "finale" && (
        <div className="space-y-3 pl-2">
          <div className="space-y-2">
            <Label htmlFor={`${value.id}-message`}>Message</Label>
            <Input
              id={`${value.id}-message`}
              value={value.message}
              onChange={(e) => onChange({ ...value, message: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${value.id}-recipient`}>Their name (optional)</Label>
            <Input
              id={`${value.id}-recipient`}
              value={value.recipientName ?? ""}
              onChange={(e) => onChange({ ...value, recipientName: e.target.value || undefined })}
              placeholder="e.g. Jane"
            />
          </div>
        </div>
      )}
    </div>
  );
}
