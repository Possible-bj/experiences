"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { CalendarConfig } from "@/lib/flow/components/calendar/schema";

export function CalendarInspector({
  value,
  onChange,
}: {
  value: CalendarConfig;
  onChange: (value: CalendarConfig) => void;
}) {
  function updateCell(index: number, patch: Partial<CalendarConfig["cells"][number]>) {
    onChange({ ...value, cells: value.cells.map((c, i) => (i === index ? { ...c, ...patch } : c)) });
  }

  function removeCell(index: number) {
    onChange({ ...value, cells: value.cells.filter((_, i) => i !== index) });
  }

  function addCell() {
    const n = value.cells.length + 1;
    onChange({
      ...value,
      cells: [
        ...value.cells,
        { unlockDate: new Date().toISOString().slice(0, 10), label: String(n), revealedText: `Day ${n} surprise!` },
      ],
    });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="calendar-columns">Columns</Label>
        <Input
          id="calendar-columns"
          type="number"
          min={1}
          max={10}
          value={value.columns}
          onChange={(e) => onChange({ ...value, columns: Number(e.target.value) || 5 })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="calendar-locked-label">Locked label</Label>
        <Input
          id="calendar-locked-label"
          value={value.lockedLabel}
          onChange={(e) => onChange({ ...value, lockedLabel: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Cells</Label>
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
          Add cell
        </Button>
      </div>
    </div>
  );
}
