import { auth } from "@/lib/auth";
import { listByOwner } from "@/lib/data/experiences";
import { getPlanUsage } from "@/lib/plan-usage";
import { ExperienceList } from "@/components/dashboard/experience-list";
import { UsageIndicator } from "@/components/dashboard/usage-indicator";
import { SITE_URL } from "@/lib/site-url";

export default async function DashboardPage() {
  const session = await auth();
  const ownerId = session!.user.id;
  const [experiences, usage] = await Promise.all([listByOwner(ownerId), getPlanUsage(ownerId)]);

  return (
    <div className="font-creator-sans">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="font-creator-display text-[32px] font-bold tracking-tight">My experiences</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Build, personalize, and share interactive experiences.
          </p>
        </div>
        <UsageIndicator usage={usage} />
      </div>
      <ExperienceList experiences={experiences} siteUrl={SITE_URL} />
    </div>
  );
}
