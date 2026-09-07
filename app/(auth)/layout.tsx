export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-creator-sans relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-16">
      <div className="pointer-events-none absolute top-[-160px] left-1/2 size-[560px] -translate-x-1/2 rounded-full bg-primary/16 blur-[90px]" />
      <div className="relative w-full max-w-sm rounded-[20px] border border-border bg-card p-9 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
        {children}
      </div>
    </div>
  );
}
