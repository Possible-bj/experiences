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

/**
 * Edits a Connector case's match rule only — matchType/value/min/max. Unlike
 * the older list-based `ConnectorCaseEditor`, there is no target picker: on
 * the canvas a case's target is set by dragging a connection from its
 * handle, not chosen from a dropdown.
 */
export function ConnectorCaseFields({
  value,
  onChange,
  onRemove,
}: {
  value: CustomConnectorCase;
  onChange: (value: CustomConnectorCase) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-border/60 p-2">
      <Select
        value={value.matchType}
        onValueChange={(v) => v && onChange({ ...value, matchType: v as CustomConnectorCase["matchType"] })}
      >
        <SelectTrigger className="h-8 w-24 text-xs">
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
          className="h-8 w-20 text-xs"
        />
      ) : (
        <>
          <Input
            type="number"
            value={value.min ?? ""}
            onChange={(e) => onChange({ ...value, min: e.target.value === "" ? undefined : Number(e.target.value) })}
            placeholder="Min"
            className="h-8 w-16 text-xs"
          />
          <span className="text-xs text-muted-foreground">to</span>
          <Input
            type="number"
            value={value.max ?? ""}
            onChange={(e) => onChange({ ...value, max: e.target.value === "" ? undefined : Number(e.target.value) })}
            placeholder="Max"
            className="h-8 w-16 text-xs"
          />
        </>
      )}

      <Button type="button" variant="ghost" size="sm" className="ml-auto h-8 px-2 text-xs" onClick={onRemove}>
        Remove
      </Button>
    </div>
  );
}
