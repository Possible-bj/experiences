import type { DisplayComponentDefinition } from "@/lib/flow/types";
import {
  LocationInputConfigSchema,
  locationInputDefaultConfig,
  type LocationInputConfig,
} from "@/lib/flow/components/location-input/schema";
import { LocationInputInspector } from "@/lib/flow/components/location-input/Inspector";
import { LocationInputRenderer } from "@/lib/flow/components/location-input/Renderer";

export const locationInputComponentType: DisplayComponentDefinition<LocationInputConfig> = {
  type: "location-input",
  label: "Location",
  configSchema: LocationInputConfigSchema,
  defaultConfig: locationInputDefaultConfig,
  Inspector: LocationInputInspector,
  Renderer: LocationInputRenderer,
};
