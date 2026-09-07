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
import { NodeEditor } from "@/components/experiences/custom/node-editor";
import { CUSTOM_THEMES, type CustomConfig, type CustomNode } from "@/lib/experience-types/custom/schema";
import { THEME_PRESETS } from "@/lib/flow/style";
import { textDefaultConfig } from "@/lib/flow/components/text/schema";

const NODE_TYPE_SHORT_LABEL: Record<CustomNode["type"], string> = {
  display: "Screen",
  connector: "Connector",
  finale: "Ending",
};

function createId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function CustomConfigForm({
  value,
  onChange,
}: {
  value: CustomConfig;
  onChange: (value: CustomConfig) => void;
}) {
  function set<K extends keyof CustomConfig>(key: K, next: CustomConfig[K]) {
    onChange({ ...value, [key]: next });
  }

  function updateNode(index: number, next: CustomNode) {
    set("nodes", value.nodes.map((n, i) => (i === index ? next : n)));
  }

  function removeNode(index: number) {
    set("nodes", value.nodes.filter((_, i) => i !== index));
  }

  function moveNode(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= value.nodes.length) return;
    const nodes = [...value.nodes];
    [nodes[index], nodes[target]] = [nodes[target], nodes[index]];
    set("nodes", nodes);
  }

  function addNode() {
    const newNode: CustomNode = {
      id: createId(),
      type: "display",
      components: [{ id: createId(), type: "text", config: textDefaultConfig }],
    };
    // Insert before a trailing Finale rather than after it — a Finale never
    // advances, so a step placed after one would be unreachable by default.
    const lastNode = value.nodes[value.nodes.length - 1];
    const nodes =
      lastNode?.type === "finale"
        ? [...value.nodes.slice(0, -1), newNode, lastNode]
        : [...value.nodes, newNode];
    set("nodes", nodes);
  }

  const targetOptions = value.nodes.map((node, i) => ({
    id: node.id,
    label: `${i + 1}. ${NODE_TYPE_SHORT_LABEL[node.type]}`,
  }));

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>Steps (played in order — a Connector can send the player anywhere, including back to an earlier step)</Label>
        {value.nodes.map((node, i) => (
          <NodeEditor
            key={node.id}
            value={node}
            targetOptions={targetOptions.filter((t) => t.id !== node.id)}
            canMoveUp={i > 0}
            canMoveDown={i < value.nodes.length - 1}
            onChange={(next) => updateNode(i, next)}
            onRemove={() => removeNode(i)}
            onMoveUp={() => moveNode(i, -1)}
            onMoveDown={() => moveNode(i, 1)}
          />
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addNode}>
          Add step
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="theme">Theme</Label>
        <Select value={value.theme} onValueChange={(v) => v && set("theme", v as CustomConfig["theme"])}>
          <SelectTrigger id="theme">
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

      <div className="space-y-2">
        <Label htmlFor="backgroundImageUrl">Background image URL (optional)</Label>
        <Input
          id="backgroundImageUrl"
          type="url"
          value={value.backgroundImageUrl ?? ""}
          onChange={(e) => set("backgroundImageUrl", e.target.value || undefined)}
          placeholder="https://..."
        />
      </div>
    </div>
  );
}
