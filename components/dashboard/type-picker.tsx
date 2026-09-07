import Link from "next/link";
import { listExperienceTypes } from "@/lib/experience-types/registry";
import { UsageIndicator } from "@/components/dashboard/usage-indicator";
import type { PlanUsage } from "@/lib/plan-usage";

export function TypePicker({ usage, backHref }: { usage: PlanUsage; backHref: string }) {
  const availableTypes = listExperienceTypes();

  return (
    <div>
      <div className="flex h-16 items-center gap-3 border-b border-border px-4 sm:gap-4.5 sm:px-7">
        <Link href={backHref} className="shrink-0 text-muted-foreground hover:text-foreground">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </Link>
        <div className="h-5.5 w-px shrink-0 bg-border" />
        <h1 className="font-creator-display truncate text-[17px] font-semibold sm:text-[19px]">Choose an experience type</h1>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-7 sm:py-10">
        <UsageIndicator usage={usage} className="mb-8" />

        <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2 lg:grid-cols-3">
          {availableTypes.map((t) => {
            const { used, limit } = usage[t.category];
            const disabled = used >= limit;
            const isCustom = t.category === "custom";

            const iconAndTag = (
              <>
                <div
                  className={`mb-4 flex size-[38px] items-center justify-center rounded-[10px] ${isCustom ? "bg-primary/20" : "bg-secondary"}`}
                >
                  {isCustom ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M4 19.5V15a1 1 0 0 1 .3-.7l10-10a1 1 0 0 1 1.4 0l3 3a1 1 0 0 1 0 1.4l-10 10a1 1 0 0 1-.7.3H4.5a.5.5 0 0 1-.5-.5z" />
                      <path d="M13 6l5 5" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <circle cx="5" cy="19" r="2" />
                      <circle cx="12" cy="10" r="2" />
                      <circle cx="19" cy="5" r="2" />
                      <path d="M6.6 17.6 10.4 11.6M13.6 8.4 17.4 6.4" />
                    </svg>
                  )}
                </div>
                <h3 className="font-creator-display mb-1.5 text-base font-semibold">{t.label}</h3>
                <p className="mb-3.5 text-[13px] leading-relaxed text-muted-foreground">{t.description}</p>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase ${
                      isCustom ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {isCustom ? "Custom" : "System"}
                  </span>
                  {disabled && <span className="text-[11.5px] text-muted-foreground/70">{used} of {limit} used</span>}
                </div>
              </>
            );

            const cardClassName = `rounded-[18px] border p-5.5 transition-[transform] ${
              disabled
                ? "cursor-default border-border opacity-55"
                : "cursor-pointer border-border not-disabled:hover:-translate-y-0.5"
            } ${isCustom ? "bg-gradient-to-br from-primary/10 via-60% to-card" : "bg-card"}`;

            return disabled ? (
              <div key={t.key} className={cardClassName}>
                {iconAndTag}
              </div>
            ) : (
              <Link key={t.key} href={`/new/${t.key}`} className={cardClassName}>
                {iconAndTag}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
