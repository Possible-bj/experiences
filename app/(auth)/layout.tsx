export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-16"
      style={{
        background:
          "radial-gradient(120% 100% at 50% -10%, oklch(0.94 0.05 20) 0%, oklch(0.99 0.006 70) 55%)",
      }}
    >
      <div className="w-full max-w-sm rounded-2xl border border-border/60 bg-card/90 p-8 shadow-lg shadow-black/[0.03] backdrop-blur">
        {children}
      </div>
    </div>
  );
}
