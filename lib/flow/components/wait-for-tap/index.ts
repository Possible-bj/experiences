import type { DisplayComponentDefinition } from "@/lib/flow/types";
import {
  WaitForTapConfigSchema,
  waitForTapDefaultConfig,
  type WaitForTapConfig,
} from "@/lib/flow/components/wait-for-tap/schema";
import { WaitForTapInspector } from "@/lib/flow/components/wait-for-tap/Inspector";
import { WaitForTapRenderer } from "@/lib/flow/components/wait-for-tap/Renderer";

export const waitForTapComponentType: DisplayComponentDefinition<WaitForTapConfig> = {
  type: "wait-for-tap",
  label: "Wait for tap",
  configSchema: WaitForTapConfigSchema,
  defaultConfig: waitForTapDefaultConfig,
  Inspector: WaitForTapInspector,
  Renderer: WaitForTapRenderer,
};
