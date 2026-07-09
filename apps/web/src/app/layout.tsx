import type { Metadata } from "next";
import { Archivo, JetBrains_Mono, Inter } from "next/font/google";
import { profile } from "@/data/profile";
import "./globals.css";

const display = Archivo({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-display",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.role}`,
  description: profile.aboutHeadline,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${mono.variable} ${sans.variable} bg-page bg-stripes font-sans text-ink`}
      >
        {children}
      </body>
    </html>
  );
}
