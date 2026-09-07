"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogoMark } from "@/components/brand/logo-mark";
import { FlowPlayer } from "@/components/flow/flow-player";
import { createExperienceAction, updateExperienceAction } from "@/actions/experiences";
import { getExperienceType } from "@/lib/experience-types/registry";
import type { Experience, ExperienceVisibility } from "@/lib/schemas/experience";
import { SITE_URL } from "@/lib/site-url";

type Props =
  | { mode: "create"; typeKey: string }
  | { mode: "edit"; experience: Experience };

export function ExperienceEditor(props: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const typeKey = props.mode === "create" ? props.typeKey : props.experience.type;
  const definition = getExperienceType(typeKey);

  const [title, setTitle] = useState(props.mode === "edit" ? props.experience.title : "");
  const [visibility, setVisibility] = useState<ExperienceVisibility>(
    props.mode === "edit" ? props.experience.visibility : "private",
  );
  const [config, setConfig] = useState<unknown>(
    props.mode === "edit" ? props.experience.config : definition?.defaultConfig,
  );

  if (!definition) {
    return <p className="p-8 text-sm text-destructive">Unknown experience type.</p>;
  }

  function handleSubmit() {
    setError(null);

    const input = { type: typeKey, title, visibility, config };

    startTransition(async () => {
      const result =
        props.mode === "create"
          ? await createExperienceAction(input)
          : await updateExperienceAction(props.experience._id, input);

      if (!result.success) {
        setError(result.error);
        toast.error(result.error);
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
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-sm space-y-4 text-center">
          <LogoMark size={30} className="mx-auto text-primary" />
          <h2 className="font-creator-display text-2xl font-bold tracking-tight">Your experience is ready</h2>
          <p className="text-sm text-muted-foreground">Share this link — no login required to view it.</p>
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
      </div>
    );
  }

  const { flow, style } = definition.buildFlow(config);

  return (
    <div className="flex h-screen flex-col">
      {/* Top bar */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-6">
        <div className="flex min-w-0 items-center gap-4">
          <Link href={props.mode === "create" ? "/new" : "/dashboard"} className="text-muted-foreground hover:text-foreground">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </Link>
          <div className="h-5.5 w-px bg-border" />
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled experience"
            className="font-creator-display min-w-0 border-none bg-transparent text-[19px] font-semibold outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex shrink-0 items-center gap-3.5">
          <div className="inline-flex rounded-full border border-border bg-secondary p-0.5">
            {(["private", "public"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVisibility(v)}
                className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-medium capitalize ${
                  visibility === v ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {error && <p className="border-b border-border bg-destructive/10 px-6 py-2 text-sm text-destructive">{error}</p>}

      {/* Body */}
      <div className="flex min-h-0 flex-1">
        {/* Left settings panel */}
        <div className="w-[460px] shrink-0 overflow-y-auto border-r border-border p-6">
          <div className="mb-4 rounded-2xl border border-border bg-card p-5">
            <p className="mb-2 text-[11.5px] font-semibold tracking-wide text-muted-foreground/80 uppercase">Basics</p>
            <div className="flex items-center gap-2.5 py-1">
              <div className="flex size-[30px] items-center justify-center rounded-lg bg-secondary">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <circle cx="5" cy="19" r="2" />
                  <circle cx="12" cy="10" r="2" />
                  <circle cx="19" cy="5" r="2" />
                  <path d="M6.6 17.6 10.4 11.6M13.6 8.4 17.4 6.4" />
                </svg>
              </div>
              <span className="text-[13.5px] font-medium">{definition.label}</span>
              <span className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground/70">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 10V8a6 6 0 0 1 12 0v2h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1zm2 0h8V8a4 4 0 0 0-8 0z" />
                </svg>
                type is fixed
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-3.5 text-[11.5px] font-semibold tracking-wide text-muted-foreground/80 uppercase">
              {definition.label} settings
            </p>
            <definition.ConfigForm value={config} onChange={setConfig} />
          </div>
        </div>

        {/* Right preview panel */}
        <div className="flex flex-1 items-center justify-center overflow-y-auto bg-black/25 p-8">
          <div className="w-full max-w-sm overflow-hidden rounded-[18px] border border-border shadow-[0_30px_70px_rgba(0,0,0,0.5)]">
            <div className="flex h-[38px] items-center gap-1.5 border-b border-border bg-card px-3">
              <div className="size-2 rounded-full bg-[#e0625b]" />
              <div className="size-2 rounded-full bg-[#e0b95b]" />
              <div className="size-2 rounded-full bg-[#6bbf7a]" />
              <div className="mx-auto rounded-full bg-secondary px-3 py-0.5 font-mono text-[11px] text-muted-foreground/70">
                {SITE_URL.replace(/^https?:\/\//, "")}/e/…
              </div>
            </div>
            <div className="h-[560px] overflow-hidden">
              <FlowPlayer key={JSON.stringify(config)} flow={flow} style={style} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
