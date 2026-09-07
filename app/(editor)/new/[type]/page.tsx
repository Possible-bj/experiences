import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getExperienceType } from "@/lib/experience-types/registry";
import { getPlanUsage } from "@/lib/plan-usage";
import { ExperienceEditor } from "@/components/dashboard/experience-editor";

export default async function NewExperienceEditorPage({
  params,
}: PageProps<"/new/[type]">) {
  const { type } = await params;
  const definition = getExperienceType(type);
  if (!definition) notFound();

  const session = await auth();
  const usage = await getPlanUsage(session!.user.id);
  const { used, limit } = usage[definition.category];
  // Defense in depth — the type picker already hides types at their limit,
  // and createExperienceAction re-checks server-side regardless. This just
  // catches a direct URL visit to a type that's since become unavailable.
  if (used >= limit) redirect("/new");

  return <ExperienceEditor mode="create" typeKey={type} />;
}
