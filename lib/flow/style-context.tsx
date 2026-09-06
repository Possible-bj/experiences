"use client";

import { createContext, useContext } from "react";
import { THEME_PRESETS, type ExperienceStyle } from "@/lib/flow/style";

const StyleContext = createContext<ExperienceStyle | null>(null);

export function StyleProvider({
  style,
  children,
}: {
  style: ExperienceStyle;
  children: React.ReactNode;
}) {
  return <StyleContext.Provider value={style}>{children}</StyleContext.Provider>;
}

/** The active experience style, plus its resolved theme preset for convenience. */
export function useExperienceStyle() {
  const style = useContext(StyleContext);
  if (!style) throw new Error("useExperienceStyle must be used within a StyleProvider");
  return { style, theme: THEME_PRESETS[style.theme] };
}
