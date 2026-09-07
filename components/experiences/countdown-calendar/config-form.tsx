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
import {
  COUNTDOWN_CALENDAR_THEMES,
  type CountdownCalendarConfig,
} from "@/lib/experience-types/countdown-calendar/schema";
import { THEME_PRESETS } from "@/lib/flow/style";

export function CountdownCalendarConfigForm({
  value,
  onChange,
}: {
  value: CountdownCalendarConfig;
  onChange: (value: CountdownCalendarConfig) => void;
}) {
  function set<K extends keyof CountdownCalendarConfig>(key: K, next: CountdownCalendarConfig[K]) {
    onChange({ ...value, [key]: next });
  }

  function updateCell(index: number, patch: Partial<CountdownCalendarConfig["cells"][number]>) {
    set("cells", value.cells.map((c, i) => (i === index ? { ...c, ...patch } : c)));
  }

  function removeCell(index: number) {
    set("cells", value.cells.filter((_, i) => i !== index));
  }

  function addCell() {
    const n = value.cells.length + 1;
    set("cells", [
      ...value.cells,
      { unlockDate: new Date().toISOString().slice(0, 10), label: String(n), revealedText: `Day ${n} surprise!` },
    ]);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="columns">Columns</Label>
        <Input
          id="columns"
          type="number"
          min={1}
          max={10}
          value={value.columns}
          onChange={(e) => set("columns", Number(e.target.value) || 5)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lockedLabel">Locked label</Label>
        <Input
          id="lockedLabel"
          value={value.lockedLabel}
          onChange={(e) => set("lockedLabel", e.target.value)}
        />
      </div>

      <div className="space-y-4">
        <Label>Days</Label>
        <p className="text-xs text-muted-foreground">
          Each day unlocks at local midnight on its date — tapping it once unlocked
          reveals its text or image.
        </p>
        {value.cells.map((cell, i) => (
          <div key={i} className="space-y-2 rounded-lg border border-border/60 p-3">
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={cell.unlockDate}
                onChange={(e) => updateCell(i, { unlockDate: e.target.value })}
                className="flex-1"
              />
              <Input
                value={cell.label ?? ""}
                onChange={(e) => updateCell(i, { label: e.target.value || undefined })}
                placeholder="Label"
                className="w-24"
              />
              <Button type="button" variant="ghost" size="sm" onClick={() => removeCell(i)}>
                Remove
              </Button>
            </div>
            <Input
              value={cell.revealedText ?? ""}
              onChange={(e) => updateCell(i, { revealedText: e.target.value || undefined })}
              placeholder="Revealed text"
            />
            <Input
              type="url"
              value={cell.revealedImageUrl ?? ""}
              onChange={(e) => updateCell(i, { revealedImageUrl: e.target.value || undefined })}
              placeholder="Revealed image URL (optional)"
            />
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addCell}>
          Add day
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="theme">Theme</Label>
        <Select value={value.theme} onValueChange={(v) => v && set("theme", v as CountdownCalendarConfig["theme"])}>
          <SelectTrigger id="theme">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {COUNTDOWN_CALENDAR_THEMES.map((theme) => (
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
