"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { SingleSelectConfig } from "@/lib/flow/components/single-select/schema";

export function SingleSelectInspector({
  value,
  onChange,
}: {
  value: SingleSelectConfig;
  onChange: (value: SingleSelectConfig) => void;
}) {
  function updateOption(index: number, patch: Partial<{ label: string; value: string; points: number }>) {
    const options = value.options.map((o, i) => (i === index ? { ...o, ...patch } : o));
    onChange({ ...value, options });
  }

  function removeOption(index: number) {
    onChange({ ...value, options: value.options.filter((_, i) => i !== index) });
  }

  function addOption() {
    const n = value.options.length + 1;
    onChange({ ...value, options: [...value.options, { label: `Option ${n}`, value: `option-${n}` }] });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="select-prompt">Prompt (optional)</Label>
        <Input
          id="select-prompt"
          value={value.prompt ?? ""}
          onChange={(e) => onChange({ ...value, prompt: e.target.value || undefined })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="select-variable">Save the choice as</Label>
        <Input
          id="select-variable"
          value={value.variableName}
          onChange={(e) => onChange({ ...value, variableName: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Options</Label>
        {value.options.map((option, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              value={option.label}
              onChange={(e) => updateOption(i, { label: e.target.value })}
              placeholder="Label"
            />
            <Input
              value={option.value}
              onChange={(e) => updateOption(i, { value: e.target.value })}
              placeholder="Value"
              className="w-28"
            />
            <Input
              type="number"
              value={option.points ?? ""}
              onChange={(e) => updateOption(i, { points: e.target.value === "" ? undefined : Number(e.target.value) })}
              placeholder="Points"
              className="w-24"
            />
            <Button type="button" variant="ghost" size="sm" onClick={() => removeOption(i)}>
              Remove
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addOption}>
          Add option
        </Button>
      </div>
      <div className="space-y-2">
        <Label htmlFor="select-score-variable">Add points to (optional)</Label>
        <Input
          id="select-score-variable"
          value={value.scoreVariable ?? ""}
          onChange={(e) => onChange({ ...value, scoreVariable: e.target.value || undefined })}
          placeholder="e.g. score"
        />
      </div>
    </div>
  );
}
