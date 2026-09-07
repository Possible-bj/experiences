import { notFound } from "next/navigation";
import { getBySlug, incrementViewCount } from "@/lib/data/experiences";
import { getExperienceType } from "@/lib/experience-types/registry";
import { applyOverrides } from "@/lib/personalization";
import { decodePersonalizationToken } from "@/lib/personalization-token";
import { FlowPlayer } from "@/components/flow/flow-player";

export default async function PlayExperiencePage({
  params,
  searchParams,
}: PageProps<"/e/[slug]">) {
  const { slug } = await params;
  const query = await searchParams;
  const experience = await getBySlug(slug);

  if (!experience) {
    notFound();
  }

  const definition = getExperienceType(experience.type);
  if (!definition) {
    notFound();
  }

  // The personalization payload is a single encrypted token (`?p=...`),
  // never plain `?field=value` pairs — the field names and override text
  // never appear in the link. Decryption failure (tampered, stale, or no
  // token at all) just means no overrides, not an error. Even once
  // decrypted, a path may only override what the owner explicitly allowed
  // (experience.shareableFields) — never an arbitrary key from the token.
  const rawToken = query.p;
  const decoded = typeof rawToken === "string" ? decodePersonalizationToken(rawToken) : null;
  const overrides: Record<string, string> = {};
  if (decoded) {
    for (const path of experience.shareableFields) {
      const value = decoded[path];
      if (typeof value === "string" && value.length > 0) {
        overrides[path] = value;
      }
    }
  }

  const personalizedConfig = Object.keys(overrides).length > 0 ? applyOverrides(experience.config, overrides) : experience.config;
  let configResult = definition.configSchema.safeParse(personalizedConfig);
  if (!configResult.success) {
    configResult = definition.configSchema.safeParse(experience.config);
  }
  if (!configResult.success) {
    notFound();
  }

  void incrementViewCount(slug);

  const { flow, style } = definition.buildFlow(configResult.data);

  return <FlowPlayer flow={flow} style={style} />;
}
