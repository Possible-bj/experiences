"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { REVEAL_GESTURES, type RevealConfig } from "@/lib/flow/components/reveal/schema";

const GESTURE_LABELS: Record<(typeof REVEAL_GESTURES)[number], string> = {
  tap: "Tap",
  swipe: "Swipe",
  scratch: "Scratch",
};

export function RevealInspector({
  value,
  onChange,
}: {
  value: RevealConfig;
  onChange: (value: RevealConfig) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reveal-gesture">Gesture</Label>
        <Select value={value.gesture} onValueChange={(v) => v && onChange({ ...value, gesture: v as RevealConfig["gesture"] })}>
          <SelectTrigger id="reveal-gesture">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {REVEAL_GESTURES.map((g) => (
              <SelectItem key={g} value={g}>
                {GESTURE_LABELS[g]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reveal-covered-label">Covered label</Label>
        <Input
          id="reveal-covered-label"
          value={value.coveredLabel}
          onChange={(e) => onChange({ ...value, coveredLabel: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reveal-covered-color">Covered color</Label>
        <Input
          id="reveal-covered-color"
          type="color"
          value={value.coveredColor}
          onChange={(e) => onChange({ ...value, coveredColor: e.target.value })}
          className="h-10 w-16 p-1"
        />
      </div>

      {value.gesture === "scratch" && (
        <div className="space-y-2">
          <Label htmlFor="reveal-threshold">Reveal after clearing (%)</Label>
          <Input
            id="reveal-threshold"
            type="number"
            min={1}
            max={100}
            value={value.revealThreshold}
            onChange={(e) => onChange({ ...value, revealThreshold: Number(e.target.value) || 40 })}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="reveal-text">Revealed text</Label>
        <Input
          id="reveal-text"
          value={value.revealedText ?? ""}
          onChange={(e) => onChange({ ...value, revealedText: e.target.value || undefined })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reveal-image">Revealed image URL (optional)</Label>
        <Input
          id="reveal-image"
          type="url"
          value={value.revealedImageUrl ?? ""}
          onChange={(e) => onChange({ ...value, revealedImageUrl: e.target.value || undefined })}
          placeholder="https://..."
        />
      </div>
    </div>
  );
}
