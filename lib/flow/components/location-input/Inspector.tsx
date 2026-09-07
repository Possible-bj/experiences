"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { LocationInputConfig } from "@/lib/flow/components/location-input/schema";

export function LocationInputInspector({
  value,
  onChange,
}: {
  value: LocationInputConfig;
  onChange: (value: LocationInputConfig) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="location-prompt">Prompt (optional)</Label>
        <Input
          id="location-prompt"
          value={value.prompt ?? ""}
          onChange={(e) => onChange({ ...value, prompt: e.target.value || undefined })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="location-placeholder">Placeholder</Label>
        <Input
          id="location-placeholder"
          value={value.placeholder}
          onChange={(e) => onChange({ ...value, placeholder: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="location-variable">Save the answer as</Label>
        <Input
          id="location-variable"
          value={value.variableName}
          onChange={(e) => onChange({ ...value, variableName: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">A Connector can branch on this name later.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="location-button">Button label</Label>
        <Input
          id="location-button"
          value={value.buttonLabel}
          onChange={(e) => onChange({ ...value, buttonLabel: e.target.value })}
        />
      </div>
    </div>
  );
}
