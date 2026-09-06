import Link from "next/link";
import { SignOutButton } from "@/components/dashboard/sign-out-button";

export function AppHeader() {
  return (
    <header className="flex items-center justify-between border-b border-border/60 px-6 py-4">
      <div className="flex items-center gap-8">
        <Link href="/dashboard" className="font-display flex items-center gap-1.5 text-lg italic">
          <span className="text-primary">♥</span> Experiences
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium text-muted-foreground">
          <Link href="/dashboard" className="hover:text-foreground">
            My experiences
          </Link>
          <Link href="/dashboard/new" className="hover:text-foreground">
            New
          </Link>
          <Link href="/discover" className="hover:text-foreground">
            Discover
          </Link>
        </nav>
      </div>
      <SignOutButton />
    </header>
  );
}
