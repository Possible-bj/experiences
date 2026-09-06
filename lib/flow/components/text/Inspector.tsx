"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { TextConfig } from "@/lib/flow/components/text/schema";

export function TextInspector({
  value,
  onChange,
}: {
  value: TextConfig;
  onChange: (value: TextConfig) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="text-content">Text</Label>
        <Input
          id="text-content"
          value={value.text}
          onChange={(e) => onChange({ ...value, text: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="text-highlight">Tappable word (optional)</Label>
        <Input
          id="text-highlight"
          value={value.highlightToken ?? ""}
          onChange={(e) => onChange({ ...value, highlightToken: e.target.value || undefined })}
          placeholder="Must appear inside the text above"
        />
        <p className="text-xs text-muted-foreground">
          Tapping this word advances to the next step. Leave blank to make the whole line tappable.
        </p>
      </div>
    </div>
  );
}
