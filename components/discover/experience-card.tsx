import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getExperienceType } from "@/lib/experience-types/registry";
import type { Experience } from "@/lib/schemas/experience";

export function ExperienceCard({ experience }: { experience: Experience }) {
  const type = getExperienceType(experience.type);

  return (
    <Card className="shadow-sm shadow-black/[0.02] transition-shadow hover:shadow-md">
      <CardHeader>
        <CardTitle className="truncate italic">{experience.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{type?.label ?? experience.type}</p>
      </CardContent>
      <CardFooter>
        <Link
          href={`/e/${experience.slug}`}
          className="text-sm font-medium underline underline-offset-4"
        >
          Play it →
        </Link>
      </CardFooter>
    </Card>
  );
}
