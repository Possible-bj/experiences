"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { DateInputConfig } from "@/lib/flow/components/date-input/schema";

export function DateInputInspector({
  value,
  onChange,
}: {
  value: DateInputConfig;
  onChange: (value: DateInputConfig) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="date-prompt">Prompt (optional)</Label>
        <Input
          id="date-prompt"
          value={value.prompt ?? ""}
          onChange={(e) => onChange({ ...value, prompt: e.target.value || undefined })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="date-min">Earliest allowed date (optional)</Label>
        <Input
          id="date-min"
          type="date"
          value={value.minDate ?? ""}
          onChange={(e) => onChange({ ...value, minDate: e.target.value || undefined })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="date-max">Latest allowed date (optional)</Label>
        <Input
          id="date-max"
          type="date"
          value={value.maxDate ?? ""}
          onChange={(e) => onChange({ ...value, maxDate: e.target.value || undefined })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="date-variable">Save the answer as</Label>
        <Input
          id="date-variable"
          value={value.variableName}
          onChange={(e) => onChange({ ...value, variableName: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">A Connector can branch on this name later.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="date-button">Button label</Label>
        <Input
          id="date-button"
          value={value.buttonLabel}
          onChange={(e) => onChange({ ...value, buttonLabel: e.target.value })}
        />
      </div>
    </div>
  );
}
