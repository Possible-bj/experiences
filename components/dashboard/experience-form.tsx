"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createExperienceAction, updateExperienceAction } from "@/actions/experiences";
import { getExperienceType, listExperienceTypes } from "@/lib/experience-types/registry";
import type { Experience, ExperienceVisibility } from "@/lib/schemas/experience";
import { SITE_URL } from "@/lib/site-url";

type Props =
  | { mode: "create" }
  | { mode: "edit"; experience: Experience };

export function ExperienceForm(props: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const availableTypes = listExperienceTypes();
  const initialType =
    props.mode === "edit" ? props.experience.type : availableTypes[0]?.key;
  const [typeKey, setTypeKey] = useState<string | undefined>(initialType);
  const definition = typeKey ? getExperienceType(typeKey) : undefined;

  const [title, setTitle] = useState(
    props.mode === "edit" ? props.experience.title : "",
  );
  const [visibility, setVisibility] = useState<ExperienceVisibility>(
    props.mode === "edit" ? props.experience.visibility : "private",
  );
  const [config, setConfig] = useState<unknown>(
    props.mode === "edit" ? props.experience.config : definition?.defaultConfig,
  );

  function handleTypeChange(nextKey: string | null) {
    if (!nextKey) return;
    setTypeKey(nextKey);
    setConfig(getExperienceType(nextKey)?.defaultConfig);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!typeKey) {
      setError("Choose an experience type.");
      return;
    }

    const input = { type: typeKey, title, visibility, config };

    startTransition(async () => {
      const result =
        props.mode === "create"
          ? await createExperienceAction(input)
          : await updateExperienceAction(props.experience._id, input);

      if (!result.success) {
        setError(result.error);
        return;
      }

      if (props.mode === "create") {
        setShareUrl(`${SITE_URL}/e/${result.data.slug}`);
        toast.success("Experience created");
      } else {
        toast.success("Experience updated");
        router.push("/dashboard");
      }
      router.refresh();
    });
  }

  if (shareUrl) {
    return (
      <div className="space-y-4 text-center">
        <span className="text-3xl">♥</span>
        <h2 className="font-display text-2xl italic">Your experience is ready</h2>
        <p className="text-sm text-muted-foreground">
          Share this link — no login required to view it.
        </p>
        <div className="flex items-center gap-2">
          <Input readOnly value={shareUrl} />
          <Button
            type="button"
            onClick={() => navigator.clipboard.writeText(shareUrl).then(() => toast.success("Copied"))}
          >
            Copy
          </Button>
        </div>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          Back to dashboard
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. For Jane"
          required
        />
      </div>

      {props.mode === "create" && (
        <div className="space-y-2">
          <Label htmlFor="type">Experience type</Label>
          <Select value={typeKey} onValueChange={handleTypeChange}>
            <SelectTrigger id="type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableTypes.map((t) => (
                <SelectItem key={t.key} value={t.key}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {definition && <p className="text-xs text-muted-foreground">{definition.description}</p>}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="visibility">Visibility</Label>
        <Select
          value={visibility}
          onValueChange={(v) => v && setVisibility(v as ExperienceVisibility)}
        >
          <SelectTrigger id="visibility">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="private">Private (unlisted — link still works)</SelectItem>
            <SelectItem value="public">Public (listed on Discover)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {definition && (
        <div className="space-y-4 rounded-xl border border-border/60 bg-muted/40 p-4">
          <p className="font-display text-sm italic">{definition.label} settings</p>
          <definition.ConfigForm value={config} onChange={setConfig} />
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={isPending} size="lg" className="w-full">
        {isPending ? "Saving..." : props.mode === "create" ? "Create experience" : "Save changes"}
      </Button>
    </form>
  );
}
