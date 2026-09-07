"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SignOutButton } from "@/components/dashboard/sign-out-button";

/**
 * Collapses the header's nav links, "New experience", and sign-out into a
 * slide-out panel below `md` — the header itself has no room to lay all of
 * that out inline once the viewport drops below a phone/tablet width.
 */
export function MobileNav({ label }: { label: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="outline" size="icon" aria-label="Open menu" />
        }
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-xs">
        <SheetHeader>
          <SheetTitle>{label}</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4">
          <SheetClose
            nativeButton={false}
            render={<Link href="/dashboard" />}
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
          >
            My experiences
          </SheetClose>
          <SheetClose
            nativeButton={false}
            render={<Link href="/discover" />}
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
          >
            Discover
          </SheetClose>
        </nav>
        <div className="mt-auto flex flex-col gap-2 border-t border-border p-4">
          <Button nativeButton={false} render={<Link href="/new" />} onClick={() => setOpen(false)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New experience
          </Button>
          <SignOutButton />
        </div>
      </SheetContent>
    </Sheet>
  );
}
