import { AppHeader } from "@/components/dashboard/app-header";

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-4xl px-6 py-10">{children}</main>
    </div>
  );
}
