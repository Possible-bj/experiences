import { z } from "zod";

// Cross-cutting visual style for a whole experience — not owned by any single
// node or component, since every screen in a flow shares one look.
export const EXPERIENCE_THEMES = ["classic", "pink", "midnight"] as const;

export const ExperienceStyleSchema = z.object({
  theme: z.enum(EXPERIENCE_THEMES).default("classic"),
  backgroundImageUrl: z.string().url().optional(),
  confettiColors: z.array(z.string()).max(6).optional(),
});

export type ExperienceStyle = z.infer<typeof ExperienceStyleSchema>;

export const THEME_PRESETS: Record<
  (typeof EXPERIENCE_THEMES)[number],
  {
    label: string;
    background: string;
    tileBg: string;
    tileFoundBg: string;
    accent: string;
    accentText: string;
    text: string;
    mutedText: string;
    confettiColors: string[];
    decorative: "hearts" | "none";
  }
> = {
  classic: {
    label: "Classic (warm dark)",
    background: "radial-gradient(120% 120% at 50% 0%, #3a2a20 0%, #201712 45%, #120c09 100%)",
    tileBg: "rgba(255,255,255,0.06)",
    tileFoundBg: "rgba(214,158,90,0.22)",
    accent: "#e0a458",
    accentText: "#1a1108",
    text: "#f5ead9",
    mutedText: "rgba(245,234,217,0.6)",
    confettiColors: ["#e0a458", "#f3d5a3", "#f5ead9", "#c0392b"],
    decorative: "none",
  },
  pink: {
    label: "Blush",
    background: "linear-gradient(160deg, #fff1ee 0%, #ffe1e8 45%, #ffd0dd 100%)",
    tileBg: "rgba(190,18,60,0.06)",
    tileFoundBg: "rgba(190,18,60,0.16)",
    accent: "#be123c",
    accentText: "#fff5f6",
    text: "#5b1428",
    mutedText: "rgba(91,20,40,0.55)",
    confettiColors: ["#fb7185", "#fda4af", "#ffffff", "#be123c", "#f5ead9"],
    decorative: "hearts",
  },
  midnight: {
    label: "Midnight",
    background: "radial-gradient(120% 120% at 50% 0%, #241b4d 0%, #14102f 55%, #0a0818 100%)",
    tileBg: "rgba(255,255,255,0.06)",
    tileFoundBg: "rgba(165,180,252,0.22)",
    accent: "#c4b5fd",
    accentText: "#1e1735",
    text: "#ece9ff",
    mutedText: "rgba(236,233,255,0.6)",
    confettiColors: ["#c4b5fd", "#a5b4fc", "#ece9ff", "#facc15"],
    decorative: "none",
  },
};

export function resolveConfettiColors(style: ExperienceStyle): string[] {
  return style.confettiColors?.length ? style.confettiColors : THEME_PRESETS[style.theme].confettiColors;
}

export function resolveBackground(style: ExperienceStyle): string {
  return style.backgroundImageUrl
    ? `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${style.backgroundImageUrl}) center/cover`
    : THEME_PRESETS[style.theme].background;
}
