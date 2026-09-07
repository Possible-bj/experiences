"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CustomConnectorCase } from "@/lib/experience-types/custom/schema";

export function ConnectorCaseEditor({
  value,
  targetOptions,
  onChange,
  onRemove,
}: {
  value: CustomConnectorCase;
  targetOptions: { id: string; label: string }[];
  onChange: (value: CustomConnectorCase) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border/60 p-2">
      <Select
        value={value.matchType}
        onValueChange={(v) => v && onChange({ ...value, matchType: v as CustomConnectorCase["matchType"] })}
      >
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="exact">Equals</SelectItem>
          <SelectItem value="range">Between</SelectItem>
        </SelectContent>
      </Select>

      {value.matchType === "exact" ? (
        <Input
          value={value.value ?? ""}
          onChange={(e) => onChange({ ...value, value: e.target.value })}
          placeholder="Value"
          className="w-28"
        />
      ) : (
        <>
          <Input
            type="number"
            value={value.min ?? ""}
            onChange={(e) => onChange({ ...value, min: e.target.value === "" ? undefined : Number(e.target.value) })}
            placeholder="Min"
            className="w-20"
          />
          <span className="text-sm text-muted-foreground">to</span>
          <Input
            type="number"
            value={value.max ?? ""}
            onChange={(e) => onChange({ ...value, max: e.target.value === "" ? undefined : Number(e.target.value) })}
            placeholder="Max"
            className="w-20"
          />
        </>
      )}

      <span className="text-sm text-muted-foreground">→</span>

      <Select value={value.targetNodeId} onValueChange={(v) => v && onChange({ ...value, targetNodeId: v })}>
        <SelectTrigger className="flex-1 min-w-32">
          <SelectValue placeholder="Target step" />
        </SelectTrigger>
        <SelectContent>
          {targetOptions.map((t) => (
            <SelectItem key={t.id} value={t.id}>
              {t.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
        Remove
      </Button>
    </div>
  );
}
