import Link from "next/link";
import { auth } from "@/lib/auth";
import { LogoMark } from "@/components/brand/logo-mark";
import { SignOutButton } from "@/components/dashboard/sign-out-button";
import { Button } from "@/components/ui/button";

export async function AppHeader() {
  const session = await auth();
  const label = session?.user?.name || session?.user?.email || "?";
  const initial = label.charAt(0).toUpperCase();

  return (
    <header className="font-creator-sans flex h-[68px] items-center justify-between border-b border-border bg-background/85 px-10 backdrop-blur">
      <div className="flex items-center gap-10">
        <Link href="/dashboard" className="font-creator-display flex items-center gap-2 text-lg font-bold tracking-tight">
          <LogoMark className="text-primary" />
          Experiences
        </Link>
        <nav className="flex items-center gap-7 text-sm font-medium text-muted-foreground">
          <Link href="/dashboard" className="hover:text-foreground">
            My experiences
          </Link>
          <Link href="/discover" className="hover:text-foreground">
            Discover
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <Button nativeButton={false} render={<Link href="/new" />}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New experience
        </Button>
        <SignOutButton />
        <div className="flex size-[34px] items-center justify-center rounded-full bg-foreground text-[13px] font-semibold text-background">
          {initial}
        </div>
      </div>
    </header>
  );
}
