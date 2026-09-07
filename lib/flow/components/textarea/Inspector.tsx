"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { TextareaConfig } from "@/lib/flow/components/textarea/schema";

export function TextareaInspector({
  value,
  onChange,
}: {
  value: TextareaConfig;
  onChange: (value: TextareaConfig) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="textarea-prompt">Prompt (optional)</Label>
        <Input
          id="textarea-prompt"
          value={value.prompt ?? ""}
          onChange={(e) => onChange({ ...value, prompt: e.target.value || undefined })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="textarea-placeholder">Placeholder</Label>
        <Input
          id="textarea-placeholder"
          value={value.placeholder ?? ""}
          onChange={(e) => onChange({ ...value, placeholder: e.target.value || undefined })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="textarea-variable">Save the answer as</Label>
        <Input
          id="textarea-variable"
          value={value.variableName}
          onChange={(e) => onChange({ ...value, variableName: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="textarea-button">Button label</Label>
        <Input
          id="textarea-button"
          value={value.buttonLabel}
          onChange={(e) => onChange({ ...value, buttonLabel: e.target.value })}
        />
      </div>
    </div>
  );
}
