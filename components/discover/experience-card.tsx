import Link from "next/link";
import { getExperienceType } from "@/lib/experience-types/registry";
import { CopyButton } from "@/components/discover/copy-button";
import { ShareButton } from "@/components/shared/share-button";
import type { Experience } from "@/lib/schemas/experience";

export function ExperienceCard({ experience }: { experience: Experience }) {
  const type = getExperienceType(experience.type);

  return (
    <div className="group overflow-hidden rounded-[18px] border border-border bg-card transition-[box-shadow,transform] hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(0,0,0,0.3)]">
      <Link href={`/e/${experience.slug}`} className="block">
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
      </Link>

      <div className="p-5 pt-4.5">
        <Link href={`/e/${experience.slug}`}>
          <h3 className="font-creator-display mb-2.5 truncate text-lg font-semibold hover:text-primary">
            {experience.title}
          </h3>
        </Link>

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
          <span className="inline-flex items-center gap-1.5">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1 1" />
              <path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1-1" />
            </svg>
            {experience.shareCount}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <CopyButton id={experience._id} className="w-full" />
          <ShareButton experience={experience} className="w-full" />
        </div>
      </div>
    </div>
  );
}
