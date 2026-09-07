import type { ExperienceTypeDefinition } from "@/lib/experience-types/types";
import {
  ScratchRevealConfigSchema,
  scratchRevealDefaultConfig,
  type ScratchRevealConfig,
} from "@/lib/experience-types/scratch-reveal/schema";
import { ScratchRevealConfigForm } from "@/components/experiences/scratch-reveal/config-form";
import { buildScratchRevealFlow } from "@/lib/experience-types/scratch-reveal/build-flow";

export const scratchRevealType: ExperienceTypeDefinition<ScratchRevealConfig> = {
  key: "scratch-reveal",
  label: "Scratch & Reveal",
  category: "system",
  description:
    "One covered surface, one big reveal — tap, swipe, or scratch it away to show a hidden message or image. Built for big-moment announcements.",
  configSchema: ScratchRevealConfigSchema,
  defaultConfig: scratchRevealDefaultConfig,
  ConfigForm: ScratchRevealConfigForm,
  buildFlow: buildScratchRevealFlow,
};
