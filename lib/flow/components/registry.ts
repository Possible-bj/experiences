import type { DisplayComponentDefinition } from "@/lib/flow/types";
import { textComponentType } from "@/lib/flow/components/text";
import { gridComponentType } from "@/lib/flow/components/grid";
import { textboxComponentType } from "@/lib/flow/components/textbox";
import { textareaComponentType } from "@/lib/flow/components/textarea";
import { singleSelectComponentType } from "@/lib/flow/components/single-select";
import { multiSelectComponentType } from "@/lib/flow/components/multi-select";
import { waitForTapComponentType } from "@/lib/flow/components/wait-for-tap";
import { revealComponentType } from "@/lib/flow/components/reveal";
import { calendarComponentType } from "@/lib/flow/components/calendar";

// The single place to touch when adding a new display component: import its
// definition and add one entry. Nothing else (DisplayNodeRenderer, the
// inspector panel) needs to change.
/* eslint-disable @typescript-eslint/no-explicit-any */
const DISPLAY_COMPONENTS: Record<string, DisplayComponentDefinition<any>> = {
  [textComponentType.type]: textComponentType,
  [gridComponentType.type]: gridComponentType,
  [textboxComponentType.type]: textboxComponentType,
  [textareaComponentType.type]: textareaComponentType,
  [singleSelectComponentType.type]: singleSelectComponentType,
  [multiSelectComponentType.type]: multiSelectComponentType,
  [waitForTapComponentType.type]: waitForTapComponentType,
  [revealComponentType.type]: revealComponentType,
  [calendarComponentType.type]: calendarComponentType,
};

export function getDisplayComponentType(type: string): DisplayComponentDefinition<any> | undefined {
  return DISPLAY_COMPONENTS[type];
}

export function listDisplayComponentTypes(): DisplayComponentDefinition<any>[] {
  return Object.values(DISPLAY_COMPONENTS);
}
/* eslint-enable @typescript-eslint/no-explicit-any */
