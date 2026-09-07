"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { LogoMark } from "@/components/brand/logo-mark";
import { FlowPlayer } from "@/components/flow/flow-player";
import { createExperienceAction, updateExperienceAction } from "@/actions/experiences";
import { getExperienceType } from "@/lib/experience-types/registry";
import { listTextFields } from "@/lib/personalization";
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
  const [shareableFields, setShareableFields] = useState<string[]>(
    props.mode === "edit" ? (props.experience.shareableFields ?? []) : [],
  );
  const [showPreview, setShowPreview] = useState(false);
  const [showPersonalize, setShowPersonalize] = useState(false);

  if (!definition) {
    return <p className="p-8 text-sm text-destructive">Unknown experience type.</p>;
  }

  const isCanvasType = definition.category === "custom";

  function handleSubmit() {
    setError(null);

    const input = { type: typeKey, title, visibility, config, shareableFields };

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
  const personalizableFields = listTextFields(config);

  return (
    <div className="flex h-screen flex-col">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-y-2 border-b border-border px-4 py-2.5 sm:px-6">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <Link href={props.mode === "create" ? "/new" : "/dashboard"} className="shrink-0 text-muted-foreground hover:text-foreground">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </Link>
          <div className="h-5.5 w-px shrink-0 bg-border" />
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled experience"
            className="font-creator-display min-w-0 border-none bg-transparent text-[17px] font-semibold outline-none placeholder:text-muted-foreground sm:text-[19px]"
          />
        </div>
        <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto sm:gap-3.5">
          <div className="inline-flex shrink-0 rounded-full border border-border bg-secondary p-0.5">
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
          {/* Its own flex-wrap (not shrink-0) so this group only drops to a
              second line when it truly doesn't fit alongside the pill above
              — and can still wrap its own buttons if even a full line isn't
              wide enough — rather than always forcing two lines. */}
          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3.5">
            {isCanvasType && (
              <Button variant="outline" onClick={() => setShowPreview(true)}>
                Preview
              </Button>
            )}
            {/* System types show their preview inline beside the settings
                form at `md`+ — below that there's no room for both, so this
                opens the same preview as a slide-over instead of requiring
                a scroll down to a preview stacked below the form. */}
            {!isCanvasType && (
              <Button variant="outline" className="md:hidden" onClick={() => setShowPreview(true)}>
                Preview
              </Button>
            )}
            <Button variant="outline" onClick={() => setShowPersonalize(true)}>
              Personalize
            </Button>
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showPersonalize} onOpenChange={setShowPersonalize}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Personalize on share</DialogTitle>
            <DialogDescription>
              Pick which fields a shared link can override — the change lives only in that link, never in this saved
              experience.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-80 space-y-1 overflow-y-auto">
            {personalizableFields.length === 0 ? (
              <p className="text-sm text-muted-foreground">No text fields found yet — add some content first.</p>
            ) : (
              personalizableFields.map((field) => (
                <label
                  key={field.path}
                  className="flex cursor-pointer items-start gap-2.5 rounded-lg p-2 hover:bg-secondary"
                >
                  <Checkbox
                    className="mt-0.5"
                    checked={shareableFields.includes(field.path)}
                    onCheckedChange={(checked) =>
                      setShareableFields((prev) =>
                        checked ? [...prev, field.path] : prev.filter((p) => p !== field.path),
                      )
                    }
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{field.preview}</span>
                    <span className="block truncate font-mono text-xs text-muted-foreground/70">{field.path}</span>
                  </span>
                </label>
              ))
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowPersonalize(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {error && <p className="border-b border-border bg-destructive/10 px-6 py-2 text-sm text-destructive">{error}</p>}

      {/* Body */}
      {isCanvasType ? (
        <div className="min-h-0 flex-1">
          <definition.ConfigForm value={config} onChange={setConfig} />
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto md:flex-row md:overflow-hidden">
          {/* Left settings panel */}
          <div className="w-full shrink-0 overflow-y-auto p-4 sm:p-6 md:w-[420px] md:border-r md:border-border lg:w-[460px]">
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

          {/* Right preview panel — desktop only; below `md` the "Preview"
              button in the top bar opens the same content in a slide-over
              instead (see the `Sheet` near the bottom of this component). */}
          <div className="hidden items-center justify-center overflow-y-auto bg-black/25 p-4 sm:p-8 md:flex md:flex-1">
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
      )}

      {isCanvasType && showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 sm:p-8">
          <div className="w-full max-w-sm overflow-hidden rounded-[18px] border border-border shadow-[0_30px_70px_rgba(0,0,0,0.5)]">
            <div className="flex h-[38px] items-center gap-1.5 border-b border-border bg-card px-3">
              <button onClick={() => setShowPreview(false)} className="text-muted-foreground hover:text-foreground">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
              <div className="mx-auto rounded-full bg-secondary px-3 py-0.5 font-mono text-[11px] text-muted-foreground/70">
                {SITE_URL.replace(/^https?:\/\//, "")}/e/…
              </div>
            </div>
            <div className="h-[560px] overflow-hidden">
              <FlowPlayer key={JSON.stringify(config)} flow={flow} style={style} />
            </div>
          </div>
        </div>
      )}

      {!isCanvasType && (
        <Sheet open={showPreview} onOpenChange={setShowPreview}>
          <SheetContent side="right" className="gap-0 p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-none">
            <SheetHeader className="shrink-0 border-b border-border">
              <SheetTitle>Preview</SheetTitle>
            </SheetHeader>
            <div className="min-h-0 flex-1 overflow-hidden bg-black/25">
              <FlowPlayer key={JSON.stringify(config)} flow={flow} style={style} />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
