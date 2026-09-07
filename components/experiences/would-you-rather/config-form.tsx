"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  WOULD_YOU_RATHER_THEMES,
  type WouldYouRatherConfig,
} from "@/lib/experience-types/would-you-rather/schema";
import { THEME_PRESETS } from "@/lib/flow/style";

export function WouldYouRatherConfigForm({
  value,
  onChange,
}: {
  value: WouldYouRatherConfig;
  onChange: (value: WouldYouRatherConfig) => void;
}) {
  function set<K extends keyof WouldYouRatherConfig>(key: K, next: WouldYouRatherConfig[K]) {
    onChange({ ...value, [key]: next });
  }

  function updateQuestion(index: number, patch: Partial<WouldYouRatherConfig["questions"][number]>) {
    set("questions", value.questions.map((q, i) => (i === index ? { ...q, ...patch } : q)));
  }

  function removeQuestion(index: number) {
    set("questions", value.questions.filter((_, i) => i !== index));
  }

  function addQuestion() {
    set("questions", [
      ...value.questions,
      {
        prompt: "Would you rather...",
        optionA: { label: "Option A", points: 0 },
        optionB: { label: "Option B", points: 10 },
      },
    ]);
  }

  function updateResult(index: number, patch: Partial<WouldYouRatherConfig["results"][number]>) {
    set("results", value.results.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }

  function removeResult(index: number) {
    set("results", value.results.filter((_, i) => i !== index));
  }

  function addResult() {
    set("results", [...value.results, { minPercent: 0, maxPercent: 100, message: "New result" }]);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>Questions</Label>
        {value.questions.map((question, qi) => (
          <div key={qi} className="space-y-2 rounded-lg border border-border/60 p-3">
            <div className="flex items-center gap-2">
              <Input
                value={question.prompt}
                onChange={(e) => updateQuestion(qi, { prompt: e.target.value })}
                placeholder="Would you rather..."
                className="flex-1"
              />
              <Button type="button" variant="ghost" size="sm" onClick={() => removeQuestion(qi)}>
                Remove question
              </Button>
            </div>
            <div className="space-y-2 pl-2">
              <div className="flex items-center gap-2">
                <Input
                  value={question.optionA.label}
                  onChange={(e) =>
                    updateQuestion(qi, { optionA: { ...question.optionA, label: e.target.value } })
                  }
                  placeholder="Option A"
                  className="flex-1"
                />
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={question.optionA.points}
                  onChange={(e) =>
                    updateQuestion(qi, {
                      optionA: { ...question.optionA, points: Number(e.target.value) || 0 },
                    })
                  }
                  placeholder="Points"
                  className="w-24"
                />
              </div>
              <div className="flex items-center gap-2">
                <Input
                  value={question.optionB.label}
                  onChange={(e) =>
                    updateQuestion(qi, { optionB: { ...question.optionB, label: e.target.value } })
                  }
                  placeholder="Option B"
                  className="flex-1"
                />
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={question.optionB.points}
                  onChange={(e) =>
                    updateQuestion(qi, {
                      optionB: { ...question.optionB, points: Number(e.target.value) || 0 },
                    })
                  }
                  placeholder="Points"
                  className="w-24"
                />
              </div>
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
          Add question
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="recipientName">Their name (optional)</Label>
        <Input
          id="recipientName"
          value={value.recipientName ?? ""}
          onChange={(e) => set("recipientName", e.target.value || undefined)}
          placeholder="e.g. Jane"
        />
      </div>

      <div className="space-y-4">
        <Label>Results (by score %)</Label>
        <p className="text-xs text-muted-foreground">
          Each pick&apos;s points contribute to a score out of the total possible —
          the result whose range that percentage falls in is shown at the end.
        </p>
        {value.results.map((result, ri) => (
          <div key={ri} className="flex items-center gap-2 rounded-lg border border-border/60 p-3">
            <Input
              type="number"
              min={0}
              max={100}
              value={result.minPercent}
              onChange={(e) => updateResult(ri, { minPercent: Number(e.target.value) || 0 })}
              placeholder="Min %"
              className="w-20"
            />
            <span className="text-sm text-muted-foreground">to</span>
            <Input
              type="number"
              min={0}
              max={100}
              value={result.maxPercent}
              onChange={(e) => updateResult(ri, { maxPercent: Number(e.target.value) || 0 })}
              placeholder="Max %"
              className="w-20"
            />
            <Input
              value={result.message}
              onChange={(e) => updateResult(ri, { message: e.target.value })}
              placeholder="Result message"
              className="flex-1"
            />
            <Button type="button" variant="ghost" size="sm" onClick={() => removeResult(ri)}>
              Remove
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addResult}>
          Add result
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="theme">Theme</Label>
        <Select value={value.theme} onValueChange={(v) => v && set("theme", v as WouldYouRatherConfig["theme"])}>
          <SelectTrigger id="theme">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {WOULD_YOU_RATHER_THEMES.map((theme) => (
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
