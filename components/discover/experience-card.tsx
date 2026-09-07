import Link from "next/link";
import { getExperienceType } from "@/lib/experience-types/registry";
import type { Experience } from "@/lib/schemas/experience";

export function ExperienceCard({ experience }: { experience: Experience }) {
  const type = getExperienceType(experience.type);

  return (
    <div className="group overflow-hidden rounded-[18px] border border-border bg-card transition-[box-shadow,transform] hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(0,0,0,0.3)]">
      <div className="relative h-32 bg-gradient-to-br from-primary/15 to-primary/30">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, transparent 0 10px, rgba(255,255,255,0.08) 10px 11px)",
          }}
        />
        <div className="absolute top-3.5 left-3.5 flex size-[34px] items-center justify-center rounded-[10px] bg-secondary shadow-[0_2px_6px_rgba(0,0,0,0.2)]">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
            <circle cx="5" cy="19" r="2" />
            <circle cx="12" cy="10" r="2" />
            <circle cx="19" cy="5" r="2" />
            <path d="M6.6 17.6 10.4 11.6M13.6 8.4 17.4 6.4" />
          </svg>
        </div>
      </div>

      <div className="p-5 pt-4.5">
        <h3 className="font-creator-display mb-2.5 truncate text-lg font-semibold">{experience.title}</h3>

        <div className="mb-3.5 flex items-center gap-2">
          <span className="rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            {type?.label ?? experience.type}
          </span>
          <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary">
            Public
          </span>
        </div>

        <div className="mb-4 flex items-center gap-4 border-t border-border pt-3 text-[13px] text-muted-foreground tabular-nums">
          <span className="inline-flex items-center gap-1.5">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {experience.viewCount}
          </span>
        </div>

        <Link
          href={`/e/${experience.slug}`}
          className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-primary px-4.5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Play it →
        </Link>
      </div>
    </div>
  );
}
