import { ExperienceForm } from "@/components/dashboard/experience-form";

export default function NewExperiencePage() {
  return (
    <div>
      <h1 className="font-display text-3xl italic">New experience</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Configure it, save, and get a shareable link.
      </p>
      <div className="mt-8 max-w-lg rounded-2xl border border-border/60 bg-card p-6 shadow-sm shadow-black/[0.02]">
        <ExperienceForm mode="create" />
      </div>
    </div>
  );
}
