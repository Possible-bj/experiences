import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getById } from "@/lib/data/experiences";
import { ExperienceEditor } from "@/components/dashboard/experience-editor";

export default async function EditExperiencePage({
  params,
}: PageProps<"/edit/[id]">) {
  const { id } = await params;
  const session = await auth();
  const experience = await getById(id);

  if (!experience || experience.ownerId !== session!.user.id) {
    notFound();
  }

  return <ExperienceEditor mode="edit" experience={experience} />;
}
