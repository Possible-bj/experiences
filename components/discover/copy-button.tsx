"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { copyExperienceAction } from "@/actions/experiences";

export function CopyButton({ id, className }: { id: string; className?: string }) {
  const [isPending, startTransition] = useTransition();

  function handleCopy() {
    startTransition(async () => {
      const result = await copyExperienceAction(id);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Added to your dashboard");
    });
  }

  return (
    <Button className={className} onClick={handleCopy} disabled={isPending}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="8" y="8" width="12" height="12" rx="2.5" />
        <path d="M4 16H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
      </svg>
      {isPending ? "Copying…" : "Copy to my dashboard"}
    </Button>
  );
}
