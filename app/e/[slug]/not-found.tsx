import Link from "next/link";
import { LogoMark } from "@/components/brand/logo-mark";

export default function ExperienceNotFound() {
  return (
    <div className="font-creator-sans flex min-h-dvh flex-col items-center justify-center gap-3 bg-background px-6 text-center">
      <LogoMark size={28} className="text-muted-foreground opacity-40" />
      <h1 className="font-creator-display text-2xl font-bold tracking-tight">This link doesn&apos;t exist</h1>
      <p className="text-sm text-muted-foreground">
        It may have been deleted, or the link was typed incorrectly.
      </p>
      <Link href="/" className="mt-4 text-sm font-medium text-primary underline underline-offset-4">
        Go home
      </Link>
    </div>
  );
}
