import Link from "next/link";
import { auth } from "@/lib/auth";
import { LogoMark } from "@/components/brand/logo-mark";
import { SignOutButton } from "@/components/dashboard/sign-out-button";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { Button } from "@/components/ui/button";

export async function AppHeader() {
  const session = await auth();
  const label = session?.user?.name || session?.user?.email || "?";
  const initial = label.charAt(0).toUpperCase();

  return (
    <header className="font-creator-sans flex h-16 items-center justify-between border-b border-border bg-background/85 px-4 backdrop-blur sm:h-[68px] sm:px-6 lg:px-10">
      <div className="flex min-w-0 items-center gap-4 sm:gap-6 lg:gap-10">
        <Link href="/dashboard" className="font-creator-display flex shrink-0 items-center gap-2 text-lg font-bold tracking-tight">
          <LogoMark className="text-primary" />
          <span className="hidden sm:inline">Experiences</span>
        </Link>
        <nav className="hidden items-center gap-4 text-sm font-medium text-muted-foreground md:flex lg:gap-7">
          <Link href="/dashboard" className="hover:text-foreground">
            My experiences
          </Link>
          <Link href="/discover" className="hover:text-foreground">
            Discover
          </Link>
        </nav>
      </div>
      <div className="hidden shrink-0 items-center gap-2 md:flex lg:gap-4">
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
      <div className="shrink-0 md:hidden">
        <MobileNav label={label} />
      </div>
    </header>
  );
}
