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
import {
  SCRATCH_REVEAL_GESTURES,
  SCRATCH_REVEAL_THEMES,
  type ScratchRevealConfig,
} from "@/lib/experience-types/scratch-reveal/schema";
import { THEME_PRESETS } from "@/lib/flow/style";

const GESTURE_LABELS: Record<(typeof SCRATCH_REVEAL_GESTURES)[number], string> = {
  tap: "Tap",
  swipe: "Swipe",
  scratch: "Scratch",
};

export function ScratchRevealConfigForm({
  value,
  onChange,
}: {
  value: ScratchRevealConfig;
  onChange: (value: ScratchRevealConfig) => void;
}) {
  function set<K extends keyof ScratchRevealConfig>(key: K, next: ScratchRevealConfig[K]) {
    onChange({ ...value, [key]: next });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="gesture">Gesture</Label>
        <Select value={value.gesture} onValueChange={(v) => v && set("gesture", v as ScratchRevealConfig["gesture"])}>
          <SelectTrigger id="gesture">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SCRATCH_REVEAL_GESTURES.map((g) => (
              <SelectItem key={g} value={g}>
                {GESTURE_LABELS[g]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="coveredLabel">Covered label</Label>
        <Input
          id="coveredLabel"
          value={value.coveredLabel}
          onChange={(e) => set("coveredLabel", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="coveredColor">Covered color</Label>
        <Input
          id="coveredColor"
          type="color"
          value={value.coveredColor}
          onChange={(e) => set("coveredColor", e.target.value)}
          className="h-10 w-16 p-1"
        />
      </div>

      {value.gesture === "scratch" && (
        <div className="space-y-2">
          <Label htmlFor="revealThreshold">Reveal after clearing (%)</Label>
          <Input
            id="revealThreshold"
            type="number"
            min={1}
            max={100}
            value={value.revealThreshold}
            onChange={(e) => set("revealThreshold", Number(e.target.value) || 40)}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="revealedText">Revealed text</Label>
        <Input
          id="revealedText"
          value={value.revealedText ?? ""}
          onChange={(e) => set("revealedText", e.target.value || undefined)}
          placeholder="It's a boy!"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="revealedImageUrl">Revealed image URL (optional)</Label>
        <Input
          id="revealedImageUrl"
          type="url"
          value={value.revealedImageUrl ?? ""}
          onChange={(e) => set("revealedImageUrl", e.target.value || undefined)}
          placeholder="https://..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="theme">Theme</Label>
        <Select value={value.theme} onValueChange={(v) => v && set("theme", v as ScratchRevealConfig["theme"])}>
          <SelectTrigger id="theme">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SCRATCH_REVEAL_THEMES.map((theme) => (
              <SelectItem key={theme} value={theme}>
                {THEME_PRESETS[theme].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="backgroundImageUrl">Background image URL (optional)</Label>
        <Input
          id="backgroundImageUrl"
          type="url"
          value={value.backgroundImageUrl ?? ""}
          onChange={(e) => set("backgroundImageUrl", e.target.value || undefined)}
          placeholder="https://..."
        />
      </div>
    </div>
  );
}
