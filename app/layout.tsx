import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Space_Grotesk, IBM_Plex_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { SITE_URL } from "@/lib/site-url";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Used only by played-experience content (Text/Finale/Grid headings, etc.)
// via the `font-display` utility — never touch this for app-chrome changes.
const playfairDisplay = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

// App-chrome only (dashboard, auth, discover, the builder forms) — kept
// entirely separate from the played-experience runtime's own fonts above,
// via the `font-creator-display`/`font-creator-sans` utilities.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Experiences",
  description: "Create and share small interactive experiences.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} ${spaceGrotesk.variable} ${ibmPlexSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
