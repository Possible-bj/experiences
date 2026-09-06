import { notFound } from "next/navigation";
import { getBySlug, incrementViewCount } from "@/lib/data/experiences";
import { getExperienceType } from "@/lib/experience-types/registry";
import { FlowPlayer } from "@/components/flow/flow-player";

export default async function PlayExperiencePage({
  params,
}: PageProps<"/e/[slug]">) {
  const { slug } = await params;
  const experience = await getBySlug(slug);

  if (!experience) {
    notFound();
  }

  const definition = getExperienceType(experience.type);
  if (!definition) {
    notFound();
  }

  const configResult = definition.configSchema.safeParse(experience.config);
  if (!configResult.success) {
    notFound();
  }

  void incrementViewCount(slug);

  const { flow, style } = definition.buildFlow(configResult.data);

  return <FlowPlayer flow={flow} style={style} />;
}
