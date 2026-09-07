"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { encodePersonalizationAction, recordShareAction } from "@/actions/experiences";
import { listTextFields } from "@/lib/personalization";
import { SITE_URL } from "@/lib/site-url";
import type { Experience } from "@/lib/schemas/experience";

/**
 * The Share entry point used both on the owner's own dashboard and on
 * Discover's cards for anyone else — same dialog, same personalization
 * flow. `recordShareAction` itself decides whether the click counts toward
 * `shareCount` (it doesn't for the owner sharing their own experience).
 */
export function ShareButton({ experience, className }: { experience: Experience; className?: string }) {
  const [open, setOpen] = useState(false);
  const [overrides, setOverrides] = useState<Record<string, string>>({});

  const fields = listTextFields(experience.config).filter((f) => experience.shareableFields.includes(f.path));

  function handleOpen() {
    const initial: Record<string, string> = {};
    fields.forEach((f) => {
      initial[f.path] = f.preview;
    });
    setOverrides(initial);
    setOpen(true);
  }

  async function finishShare(url: string, message: string) {
    try {
      await navigator.clipboard.writeText(url);
      toast.success(message);
    } catch {
      toast.error("Couldn't copy link");
      return;
    }
    await recordShareAction(experience._id);
    setOpen(false);
  }

  function copyCanonicalLink() {
    finishShare(`${SITE_URL}/e/${experience.slug}`, "Link copied");
  }

  async function copyPersonalizedLink() {
    const changed: Record<string, string> = {};
    fields.forEach((field) => {
      const value = overrides[field.path];
      if (value !== undefined && value !== field.preview) {
        changed[field.path] = value;
      }
    });
    const url = new URL(`${SITE_URL}/e/${experience.slug}`);
    if (Object.keys(changed).length > 0) {
      url.searchParams.set("p", await encodePersonalizationAction(changed));
    }
    finishShare(url.toString(), "Personalized link copied");
  }

  return (
    <>
      <Button variant="outline" className={className} onClick={handleOpen}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1 1" />
          <path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1-1" />
        </svg>
        Share
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share &ldquo;{experience.title}&rdquo;</DialogTitle>
            <DialogDescription>Anyone with this link can play it — no account needed.</DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-2">
            <Input readOnly value={`${SITE_URL}/e/${experience.slug}`} />
            <Button type="button" onClick={copyCanonicalLink}>
              Copy
            </Button>
          </div>

          {fields.length > 0 && (
            <div className="space-y-3 border-t border-border pt-4">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Personalize this link
              </p>
              {fields.map((field) =>
                field.options ? (
                  <div key={field.path} className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">{field.path}</Label>
                    <Select
                      value={overrides[field.path] ?? field.preview}
                      onValueChange={(v) => v && setOverrides((prev) => ({ ...prev, [field.path]: v }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div key={field.path} className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">{field.path}</Label>
                    <Input
                      value={overrides[field.path] ?? ""}
                      onChange={(e) => setOverrides((prev) => ({ ...prev, [field.path]: e.target.value }))}
                    />
                  </div>
                ),
              )}
              <Button type="button" variant="outline" className="w-full" onClick={copyPersonalizedLink}>
                Copy personalized link
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
