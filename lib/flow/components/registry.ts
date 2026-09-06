import type { DisplayComponentDefinition } from "@/lib/flow/types";
import { textComponentType } from "@/lib/flow/components/text";
import { gridComponentType } from "@/lib/flow/components/grid";

// The single place to touch when adding a new display component: import its
// definition and add one entry. Nothing else (DisplayNodeRenderer, the
// inspector panel) needs to change.
/* eslint-disable @typescript-eslint/no-explicit-any */
const DISPLAY_COMPONENTS: Record<string, DisplayComponentDefinition<any>> = {
  [textComponentType.type]: textComponentType,
  [gridComponentType.type]: gridComponentType,
};

export function getDisplayComponentType(type: string): DisplayComponentDefinition<any> | undefined {
  return DISPLAY_COMPONENTS[type];
}

export function listDisplayComponentTypes(): DisplayComponentDefinition<any>[] {
  return Object.values(DISPLAY_COMPONENTS);
}
/* eslint-enable @typescript-eslint/no-explicit-any */
