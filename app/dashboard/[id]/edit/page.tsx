import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getById } from "@/lib/data/experiences";
import { ExperienceForm } from "@/components/dashboard/experience-form";

export default async function EditExperiencePage({
  params,
}: PageProps<"/dashboard/[id]/edit">) {
  const { id } = await params;
  const session = await auth();
  const experience = await getById(id);

  if (!experience || experience.ownerId !== session!.user.id) {
    notFound();
  }

  return (
    <div>
      <h1 className="font-display text-3xl italic">Edit experience</h1>
      <div className="mt-8 max-w-lg rounded-2xl border border-border/60 bg-card p-6 shadow-sm shadow-black/[0.02]">
        <ExperienceForm mode="edit" experience={experience} />
      </div>
    </div>
  );
}
