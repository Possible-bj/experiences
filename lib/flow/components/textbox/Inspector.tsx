"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { TextboxConfig } from "@/lib/flow/components/textbox/schema";

export function TextboxInspector({
  value,
  onChange,
}: {
  value: TextboxConfig;
  onChange: (value: TextboxConfig) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="textbox-prompt">Prompt (optional)</Label>
        <Input
          id="textbox-prompt"
          value={value.prompt ?? ""}
          onChange={(e) => onChange({ ...value, prompt: e.target.value || undefined })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="textbox-placeholder">Placeholder</Label>
        <Input
          id="textbox-placeholder"
          value={value.placeholder ?? ""}
          onChange={(e) => onChange({ ...value, placeholder: e.target.value || undefined })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="textbox-variable">Save the answer as</Label>
        <Input
          id="textbox-variable"
          value={value.variableName}
          onChange={(e) => onChange({ ...value, variableName: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">A Connector can branch on this name later.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="textbox-button">Button label</Label>
        <Input
          id="textbox-button"
          value={value.buttonLabel}
          onChange={(e) => onChange({ ...value, buttonLabel: e.target.value })}
        />
      </div>
    </div>
  );
}
