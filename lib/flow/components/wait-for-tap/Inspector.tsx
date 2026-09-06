"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { WaitForTapConfig } from "@/lib/flow/components/wait-for-tap/schema";

export function WaitForTapInspector({
  value,
  onChange,
}: {
  value: WaitForTapConfig;
  onChange: (value: WaitForTapConfig) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="wait-hint">Hint text</Label>
      <Input
        id="wait-hint"
        value={value.hint}
        onChange={(e) => onChange({ ...value, hint: e.target.value })}
      />
    </div>
  );
}
