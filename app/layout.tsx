import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import AppShell from "@/components/AppShell";
import "./globals.css";

/** Inter and a mono for figures — the Focus Realm brand typeface pairing. */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Focus Realm · Service Execution Platform",
    template: "%s · Focus Realm",
  },
  description:
    "Your shift, the standards behind it, and the record it builds — the Focus Realm service execution console for hotel floor teams.",
};

export const viewport: Viewport = {
  themeColor: "#081527",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
