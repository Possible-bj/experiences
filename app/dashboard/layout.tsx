import { AppHeader } from "@/components/dashboard/app-header";

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-11 lg:px-10">{children}</main>
    </div>
  );
}
