import { auth } from "@/lib/auth";
import { getPlanUsage } from "@/lib/plan-usage";
import { TypePicker } from "@/components/dashboard/type-picker";

export default async function NewExperienceTypePickerPage() {
  const session = await auth();
  const usage = await getPlanUsage(session!.user.id);

  return <TypePicker usage={usage} backHref="/dashboard" />;
}
