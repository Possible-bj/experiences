"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { listFillStrategies } from "@/lib/flow/strategies/fill-strategy";
import { MISS_BEHAVIORS } from "@/lib/flow/strategies/miss-behavior";
import type { GridConfig } from "@/lib/flow/components/grid/schema";

export function GridInspector({
  value,
  onChange,
}: {
  value: GridConfig;
  onChange: (value: GridConfig) => void;
}) {
  const [linkedCellsText, setLinkedCellsText] = useState(value.linkedCells.join(", "));

  function set<K extends keyof GridConfig>(key: K, next: GridConfig[K]) {
    onChange({ ...value, [key]: next });
  }

  function handleLinkedCellsChange(text: string) {
    setLinkedCellsText(text);
    const parsed = text
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map(Number)
      .filter((n) => Number.isInteger(n) && n >= 1);
    if (parsed.length >= 2) set("linkedCells", parsed);
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="grid-cells">Cells</Label>
          <Input
            id="grid-cells"
            type="number"
            min={1}
            value={value.cells}
            onChange={(e) => set("cells", Number(e.target.value) || 1)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="grid-columns">Columns</Label>
          <Input
            id="grid-columns"
            type="number"
            min={1}
            value={value.columns}
            onChange={(e) => set("columns", Number(e.target.value) || 1)}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="grid-show-number">Show each cell&apos;s number</Label>
        <Switch
          id="grid-show-number"
          checked={value.showCellNumber}
          onCheckedChange={(checked) => set("showCellNumber", checked)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="grid-linked">Linked cells (in order)</Label>
        <Input
          id="grid-linked"
          value={linkedCellsText}
          onChange={(e) => handleLinkedCellsChange(e.target.value)}
          placeholder="50, 40, 55, 91, 84, 32, 64, 6, 80, 100"
        />
        <p className="text-xs text-muted-foreground">
          The first is where the hunt starts. Tapping the current one reveals the next — the last one ends it.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="grid-final-text">Text on the last cell</Label>
        <Input
          id="grid-final-text"
          value={value.finalCellText}
          onChange={(e) => set("finalCellText", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="grid-fill">Fill empty cells with</Label>
        <Select value={value.fillStrategy} onValueChange={(v) => v && set("fillStrategy", v as GridConfig["fillStrategy"])}>
          <SelectTrigger id="grid-fill">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {listFillStrategies().map((s) => (
              <SelectItem key={s.key} value={s.key}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {value.fillStrategy === "custom-list" && (
          <Input
            value={value.customListItems?.join(", ") ?? ""}
            onChange={(e) =>
              set(
                "customListItems",
                e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
              )
            }
            placeholder="Comma-separated items"
          />
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="grid-miss">On a missed tap</Label>
        <Select value={value.missBehavior} onValueChange={(v) => v && set("missBehavior", v as GridConfig["missBehavior"])}>
          <SelectTrigger id="grid-miss">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MISS_BEHAVIORS.map((b) => (
              <SelectItem key={b.key} value={b.key}>
                {b.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {value.missBehavior === "message" && (
          <Input
            value={value.missMessage ?? ""}
            onChange={(e) => set("missMessage", e.target.value || undefined)}
            placeholder="Not quite — keep looking."
          />
        )}
      </div>
    </div>
  );
}
