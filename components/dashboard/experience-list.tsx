"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deleteExperienceAction } from "@/actions/experiences";
import { getExperienceType } from "@/lib/experience-types/registry";
import type { Experience } from "@/lib/schemas/experience";

export function ExperienceList({
  experiences,
  siteUrl,
}: {
  experiences: Experience[];
  siteUrl: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);

  function handleCopy(slug: string) {
    const url = `${siteUrl}/e/${slug}`;
    navigator.clipboard.writeText(url).then(
      () => toast.success("Link copied"),
      () => toast.error("Couldn't copy link"),
    );
  }

  function handleDelete(id: string) {
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

  if (experiences.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border/70 bg-card/50 p-12 text-center text-sm text-muted-foreground">
        You haven&apos;t created any experiences yet.
        <div className="mt-4">
          <Button nativeButton={false} render={<Link href="/dashboard/new" />} size="sm">
            Create your first one
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {experiences.map((experience) => {
        const type = getExperienceType(experience.type);
        return (
          <li
            key={experience._id}
            className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-card p-4 shadow-sm shadow-black/[0.02] transition-shadow hover:shadow-md"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-display truncate text-lg italic">{experience.title}</p>
                <Badge variant={experience.visibility === "public" ? "default" : "secondary"}>
                  {experience.visibility}
                </Badge>
              </div>
              <p className="truncate text-xs text-muted-foreground">
                {type?.label ?? experience.type} · {experience.viewCount} view
                {experience.viewCount === 1 ? "" : "s"}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => handleCopy(experience.slug)}>
                Copy link
              </Button>
              <Button
                size="sm"
                variant="outline"
                nativeButton={false}
                render={<Link href={`/dashboard/${experience._id}/edit`} />}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="ghost"
                disabled={isPending && pendingId === experience._id}
                onClick={() => handleDelete(experience._id)}
              >
                Delete
              </Button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
