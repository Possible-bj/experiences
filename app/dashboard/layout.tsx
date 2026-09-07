import { AppHeader } from "@/components/dashboard/app-header";

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-5xl px-10 py-11">{children}</main>
    </div>
  );
}
