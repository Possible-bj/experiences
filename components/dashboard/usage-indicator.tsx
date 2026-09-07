import type { PlanUsage } from "@/lib/plan-usage";

function UsageBar({ used, limit }: { used: number; limit: number }) {
  const pct = Number.isFinite(limit) && limit > 0 ? Math.min(100, (used / limit) * 100) : 100;
  return (
    <div className="h-1.5 w-[60px] overflow-hidden rounded-full bg-secondary">
      <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function UsageIndicator({ usage, className }: { usage: PlanUsage; className?: string }) {
  return (
    <div
      className={`flex flex-wrap items-center gap-5 rounded-[14px] border border-border bg-card px-4.5 py-3 ${className ?? ""}`}
    >
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">System</span>
        <UsageBar used={usage.system.used} limit={usage.system.limit} />
        <span className="text-xs text-muted-foreground/70">
          {usage.system.used} of {Number.isFinite(usage.system.limit) ? usage.system.limit : "∞"}
        </span>
      </div>
      <div className="h-5 w-px bg-border" />
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Custom</span>
        <UsageBar used={usage.custom.used} limit={usage.custom.limit} />
        <span className="text-xs text-muted-foreground/70">
          {usage.custom.used} of {Number.isFinite(usage.custom.limit) ? usage.custom.limit : "∞"}
        </span>
      </div>
      {usage.plan === "free" && (
        <span className="text-sm font-semibold whitespace-nowrap text-primary/70">Upgrade →</span>
      )}
    </div>
  );
}
