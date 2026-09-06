import { auth } from "@/lib/auth";
import { listByOwner } from "@/lib/data/experiences";
import { ExperienceList } from "@/components/dashboard/experience-list";
import { SITE_URL } from "@/lib/site-url";

export default async function DashboardPage() {
  const session = await auth();
  const experiences = await listByOwner(session!.user.id);

  return (
    <div>
      <h1 className="font-display text-3xl italic">My experiences</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Create, edit, and share your interactive experiences.
      </p>
      <div className="mt-8">
        <ExperienceList experiences={experiences} siteUrl={SITE_URL} />
      </div>
    </div>
  );
}
