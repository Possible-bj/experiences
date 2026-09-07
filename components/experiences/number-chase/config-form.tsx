"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  NUMBER_CHASE_THEMES,
  type NumberChaseConfig,
} from "@/lib/experience-types/number-chase/schema";
import { THEME_PRESETS } from "@/lib/flow/style";

export function NumberChaseConfigForm({
  value,
  onChange,
}: {
  value: NumberChaseConfig;
  onChange: (value: NumberChaseConfig) => void;
}) {
  const [chainText, setChainText] = useState(value.chain.join(", "));

  function set<K extends keyof NumberChaseConfig>(key: K, next: NumberChaseConfig[K]) {
    onChange({ ...value, [key]: next });
  }

  function handleChainChange(text: string) {
    setChainText(text);
    const parsed = text
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map(Number)
      .filter((n) => Number.isInteger(n) && n >= 1 && n <= 100);
    if (parsed.length >= 2) {
      set("chain", parsed);
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="chain">Linked numbers (in order)</Label>
        <Input
          id="chain"
          value={chainText}
          onChange={(e) => handleChainChange(e.target.value)}
          placeholder="50, 40, 55, 91, 84, 32, 64, 6, 80, 100"
        />
        <p className="text-xs text-muted-foreground">
          The first number is where the hunt starts. Each number, once found, leads
          to the next — the last one ends the hunt.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="finalText">Text on the last number</Label>
        <Input
          id="finalText"
          value={value.finalText}
          onChange={(e) => set("finalText", e.target.value)}
          placeholder="You"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="recipientName">Their name (optional)</Label>
        <Input
          id="recipientName"
          value={value.recipientName ?? ""}
          onChange={(e) => set("recipientName", e.target.value || undefined)}
          placeholder="e.g. Jane"
        />
        <p className="text-xs text-muted-foreground">
          Shown in the finale message if provided — otherwise it&apos;s left out.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="introPrefix">Intro text</Label>
        <div className="flex items-center gap-2">
          <Input
            id="introPrefix"
            value={value.introPrefix}
            onChange={(e) => set("introPrefix", e.target.value)}
            className="flex-1"
          />
          <span className="text-sm text-muted-foreground">{value.chain[0] ?? "…"}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="finaleMessage">Finale message</Label>
        <Textarea
          id="finaleMessage"
          value={value.finaleMessage}
          onChange={(e) => set("finaleMessage", e.target.value)}
          rows={3}
        />
        <p className="text-xs text-muted-foreground">
          {value.recipientName
            ? `Shown as "${value.finaleMessage}, ${value.recipientName}!"`
            : `Shown as "${value.finaleMessage}!"`}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="theme">Theme</Label>
        <Select value={value.theme} onValueChange={(v) => v && set("theme", v as NumberChaseConfig["theme"])}>
          <SelectTrigger id="theme">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {NUMBER_CHASE_THEMES.map((theme) => (
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
