import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div
      className="relative flex flex-1 flex-col items-center justify-center gap-7 overflow-hidden px-6 py-24 text-center"
      style={{
        background:
          "radial-gradient(120% 100% at 50% -10%, oklch(0.94 0.05 20) 0%, oklch(0.99 0.006 70) 55%)",
      }}
    >
      <span className="text-4xl">♥</span>
      <h1 className="font-display max-w-xl text-4xl leading-tight font-medium text-balance italic sm:text-6xl">
        Small experiences, made for one person.
      </h1>
      <p className="max-w-md text-base text-muted-foreground">
        Create a personalized, animated moment and share it with a single
        link — no account needed to open it.
      </p>
      <div className="mt-2 flex gap-3">
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
