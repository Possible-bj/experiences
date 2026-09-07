"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShareButton } from "@/components/shared/share-button";
import { copyExperienceAction, deleteExperienceAction } from "@/actions/experiences";
import { getExperienceType } from "@/lib/experience-types/registry";
import type { Experience } from "@/lib/schemas/experience";

export function ExperienceList({ experiences }: { experiences: Experience[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  function confirmDelete() {
    const id = deleteTargetId;
    if (!id) return;
    setDeleteTargetId(null);
    setPendingId(id);
    startTransition(async () => {
      const result = await deleteExperienceAction(id);
      setPendingId(null);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Experience deleted");
      router.refresh();
    });
  }

  function handleDuplicate(id: string) {
    setPendingId(id);
    startTransition(async () => {
      const result = await copyExperienceAction(id);
      setPendingId(null);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Experience duplicated");
      router.refresh();
    });
  }

  if (experiences.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 rounded-2xl border border-dashed border-border bg-card/40 px-10 py-20 text-center">
        <div className="flex size-[72px] items-center justify-center rounded-[20px] bg-primary/15">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
            <circle cx="6" cy="18" r="2.2" />
            <circle cx="13" cy="8" r="2.2" />
            <circle cx="20" cy="4" r="2.2" />
            <path d="M7.8 16.3 11.2 9.9M14.8 6.8 18.2 5.2" />
          </svg>
        </div>
        <div>
          <h2 className="font-creator-display text-2xl font-bold tracking-tight">Build your first experience</h2>
          <p className="mx-auto mt-2.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Design a progression, add your own logic and style, then share it with a single link — no account
            needed to play it.
          </p>
        </div>
        <Button size="lg" nativeButton={false} render={<Link href="/new" />}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Create an experience
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {experiences.map((experience) => {
        const type = getExperienceType(experience.type);
        return (
          <div
            key={experience._id}
            className="group overflow-hidden rounded-[18px] border border-border bg-card transition-[box-shadow,transform] hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(0,0,0,0.3)]"
          >
            <div className="relative h-32 bg-gradient-to-br from-primary/15 to-primary/30">
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(135deg, transparent 0 10px, rgba(255,255,255,0.08) 10px 11px)",
                }}
              />
              <div className="absolute top-3.5 left-3.5 flex size-[34px] items-center justify-center rounded-[10px] bg-secondary shadow-[0_2px_6px_rgba(0,0,0,0.2)]">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <circle cx="5" cy="19" r="2" />
                  <circle cx="12" cy="10" r="2" />
                  <circle cx="19" cy="5" r="2" />
                  <path d="M6.6 17.6 10.4 11.6M13.6 8.4 17.4 6.4" />
                </svg>
              </div>
            </div>

            <div className="p-5 pt-4.5">
              <h3 className="font-creator-display mb-2.5 truncate text-[17px] font-semibold">{experience.title}</h3>

              <div className="mb-3.5 flex items-center gap-2">
                <span className="rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  {type?.label ?? experience.type}
                </span>
                {experience.visibility === "public" ? (
                  <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    Public
                  </span>
                ) : (
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                    Private
                  </span>
                )}
              </div>

              <div className="mb-4 flex items-center gap-4 border-t border-border pt-3 text-[13px] text-muted-foreground tabular-nums">
                <span className="inline-flex items-center gap-1.5">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  {experience.viewCount} view{experience.viewCount === 1 ? "" : "s"}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1 1" />
                    <path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1-1" />
                  </svg>
                  {experience.shareCount} share{experience.shareCount === 1 ? "" : "s"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <ShareButton experience={experience} className="flex-1" />
                <Button
                  variant="outline"
                  className="flex-1"
                  nativeButton={false}
                  render={<Link href={`/edit/${experience._id}`} />}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                  </svg>
                  Edit
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isPending && pendingId === experience._id}
                        aria-label="More options"
                      />
                    }
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="5" cy="12" r="1.8" />
                      <circle cx="12" cy="12" r="1.8" />
                      <circle cx="19" cy="12" r="1.8" />
                    </svg>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleDuplicate(experience._id)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="8" y="8" width="12" height="12" rx="2.5" />
                        <path d="M4 16H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
                      </svg>
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onClick={() => setDeleteTargetId(experience._id)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V6" />
                      </svg>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        );
      })}

      <Dialog open={deleteTargetId !== null} onOpenChange={(open) => !open && setDeleteTargetId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this experience?</DialogTitle>
            <DialogDescription>
              This can&apos;t be undone. The share link will stop working immediately.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
