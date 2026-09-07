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
  COMPATIBILITY_QUIZ_THEMES,
  type CompatibilityQuizConfig,
} from "@/lib/experience-types/compatibility-quiz/schema";
import { THEME_PRESETS } from "@/lib/flow/style";

export function CompatibilityQuizConfigForm({
  value,
  onChange,
}: {
  value: CompatibilityQuizConfig;
  onChange: (value: CompatibilityQuizConfig) => void;
}) {
  function set<K extends keyof CompatibilityQuizConfig>(key: K, next: CompatibilityQuizConfig[K]) {
    onChange({ ...value, [key]: next });
  }

  function updateQuestion(index: number, patch: Partial<CompatibilityQuizConfig["questions"][number]>) {
    const questions = value.questions.map((q, i) => (i === index ? { ...q, ...patch } : q));
    set("questions", questions);
  }

  function removeQuestion(index: number) {
    set("questions", value.questions.filter((_, i) => i !== index));
  }

  function addQuestion() {
    set("questions", [
      ...value.questions,
      { prompt: "New question", options: [{ label: "Option A", points: 0 }, { label: "Option B", points: 10 }] },
    ]);
  }

  function updateOption(qIndex: number, oIndex: number, patch: Partial<{ label: string; points: number }>) {
    const options = value.questions[qIndex].options.map((o, i) => (i === oIndex ? { ...o, ...patch } : o));
    updateQuestion(qIndex, { options });
  }

  function removeOption(qIndex: number, oIndex: number) {
    updateQuestion(qIndex, { options: value.questions[qIndex].options.filter((_, i) => i !== oIndex) });
  }

  function addOption(qIndex: number) {
    const n = value.questions[qIndex].options.length + 1;
    updateQuestion(qIndex, {
      options: [...value.questions[qIndex].options, { label: `Option ${n}`, points: 0 }],
    });
  }

  function updateBand(index: number, patch: Partial<CompatibilityQuizConfig["resultBands"][number]>) {
    const resultBands = value.resultBands.map((b, i) => (i === index ? { ...b, ...patch } : b));
    set("resultBands", resultBands);
  }

  function removeBand(index: number) {
    set("resultBands", value.resultBands.filter((_, i) => i !== index));
  }

  function addBand() {
    set("resultBands", [...value.resultBands, { minPercent: 0, maxPercent: 100, message: "New result" }]);
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
                placeholder="Question prompt"
                className="flex-1"
              />
              <Button type="button" variant="ghost" size="sm" onClick={() => removeQuestion(qi)}>
                Remove question
              </Button>
            </div>
            <div className="space-y-2 pl-2">
              {question.options.map((option, oi) => (
                <div key={oi} className="flex items-center gap-2">
                  <Input
                    value={option.label}
                    onChange={(e) => updateOption(qi, oi, { label: e.target.value })}
                    placeholder="Answer label"
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={option.points}
                    onChange={(e) => updateOption(qi, oi, { points: Number(e.target.value) || 0 })}
                    placeholder="Points"
                    className="w-24"
                  />
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeOption(qi, oi)}>
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => addOption(qi)}>
                Add answer
              </Button>
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
        <p className="text-xs text-muted-foreground">
          Shown in the result message if provided — otherwise it&apos;s left out.
        </p>
      </div>

      <div className="space-y-4">
        <Label>Result bands (by compatibility %)</Label>
        <p className="text-xs text-muted-foreground">
          Each answer&apos;s points contribute to a score out of the total possible —
          the band whose range that percentage falls in decides the result shown.
        </p>
        {value.resultBands.map((band, bi) => (
          <div key={bi} className="flex items-center gap-2 rounded-lg border border-border/60 p-3">
            <Input
              type="number"
              min={0}
              max={100}
              value={band.minPercent}
              onChange={(e) => updateBand(bi, { minPercent: Number(e.target.value) || 0 })}
              placeholder="Min %"
              className="w-20"
            />
            <span className="text-sm text-muted-foreground">to</span>
            <Input
              type="number"
              min={0}
              max={100}
              value={band.maxPercent}
              onChange={(e) => updateBand(bi, { maxPercent: Number(e.target.value) || 0 })}
              placeholder="Max %"
              className="w-20"
            />
            <Input
              value={band.message}
              onChange={(e) => updateBand(bi, { message: e.target.value })}
              placeholder="Result message"
              className="flex-1"
            />
            <Button type="button" variant="ghost" size="sm" onClick={() => removeBand(bi)}>
              Remove
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addBand}>
          Add result band
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="theme">Theme</Label>
        <Select value={value.theme} onValueChange={(v) => v && set("theme", v as CompatibilityQuizConfig["theme"])}>
          <SelectTrigger id="theme">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {COMPATIBILITY_QUIZ_THEMES.map((theme) => (
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
