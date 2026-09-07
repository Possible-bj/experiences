"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getDisplayComponentType,
  listDisplayComponentTypes,
} from "@/lib/flow/components/registry";
import type { CustomComponentInstance } from "@/lib/experience-types/custom/schema";

/**
 * Editing one component instance inside a Display node: pick its type, then
 * render that component's own already-built Inspector for its config — the
 * exact payoff of every component having one, even though nothing consumed
 * it until now.
 */
export function ComponentInstanceEditor({
  value,
  onChange,
  onRemove,
}: {
  value: CustomComponentInstance;
  onChange: (value: CustomComponentInstance) => void;
  onRemove: () => void;
}) {
  const definition = getDisplayComponentType(value.type);
  const availableTypes = listDisplayComponentTypes();

  function handleTypeChange(nextType: string | null) {
    if (!nextType) return;
    const nextDefinition = getDisplayComponentType(nextType);
    onChange({ ...value, type: nextType, config: nextDefinition?.defaultConfig });
  }

  return (
    <div className="space-y-3 rounded-lg border border-border/60 p-3">
      <div className="flex items-center gap-2">
        <Select value={value.type} onValueChange={handleTypeChange}>
          <SelectTrigger className="flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availableTypes.map((t) => (
              <SelectItem key={t.type} value={t.type}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
          Remove
        </Button>
      </div>

      {definition ? (
        <definition.Inspector
          value={value.config}
          onChange={(nextConfig) => onChange({ ...value, config: nextConfig })}
        />
      ) : (
        <Label className="text-xs text-destructive">Unknown component type: {value.type}</Label>
      )}
    </div>
  );
}
