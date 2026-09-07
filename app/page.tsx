import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/brand/logo-mark";

export default function LandingPage() {
  return (
    <div className="font-creator-sans relative flex flex-1 flex-col items-center justify-center gap-7 overflow-hidden bg-background px-6 py-24 text-center">
      <div className="pointer-events-none absolute top-[-160px] left-1/2 size-[560px] -translate-x-1/2 rounded-full bg-primary/16 blur-[90px]" />
      <LogoMark size={40} className="relative text-primary" />
      <h1 className="font-creator-display relative max-w-xl text-4xl leading-tight font-bold tracking-tight text-balance sm:text-6xl">
        Small interactive experiences, made to share.
      </h1>
      <p className="relative max-w-md text-base text-muted-foreground">
        Build a personalized, animated moment and share it with a single
        link — no account needed to open it.
      </p>
      <div className="relative mt-2 flex gap-3">
        <Button size="lg" nativeButton={false} render={<Link href="/signup" />}>
          Get started
        </Button>
        <Button size="lg" variant="outline" nativeButton={false} render={<Link href="/login" />}>
          Sign in
        </Button>
      </div>
    </div>
  );
}
