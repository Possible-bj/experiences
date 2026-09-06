import { listPublic } from "@/lib/data/experiences";
import { ExperienceCard } from "@/components/discover/experience-card";
import { AppHeader } from "@/components/dashboard/app-header";

// Public experiences change as users create/delete/toggle visibility — this
// must be rendered per-request, not baked into the build as a static page.
export const dynamic = "force-dynamic";

export default async function DiscoverPage() {
  const experiences = await listPublic();

  return (
    <div className="min-h-screen">
      <AppHeader />
      <div className="mx-auto max-w-4xl px-6 py-10">
        <header className="mb-8">
          <h1 className="font-display text-3xl italic">Discover</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Public experiences shared by the community.
          </p>
        </header>

        {experiences.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/70 bg-card/50 p-12 text-center text-sm text-muted-foreground">
            No public experiences yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {experiences.map((experience) => (
              <ExperienceCard key={experience._id} experience={experience} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
