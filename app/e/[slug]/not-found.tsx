import Link from "next/link";

export default function ExperienceNotFound() {
  return (
    <div
      className="flex min-h-dvh flex-col items-center justify-center gap-3 px-6 text-center"
      style={{
        background:
          "radial-gradient(120% 100% at 50% -10%, oklch(0.94 0.05 20) 0%, oklch(0.99 0.006 70) 55%)",
      }}
    >
      <span className="text-3xl opacity-40">♥</span>
      <h1 className="font-display text-2xl italic">This link doesn&apos;t exist</h1>
      <p className="text-sm text-muted-foreground">
        It may have been deleted, or the link was typed incorrectly.
      </p>
      <Link href="/" className="mt-4 text-sm font-medium underline underline-offset-4">
        Go home
      </Link>
    </div>
  );
}
