import type { Metadata } from "next";
import { Inter } from "next/font/google";

/**
 * Chrome for the intern onboarding module. Navy and gold with Inter, per the
 * current Focus Realm brand system — deliberately unlike the hospitality
 * product demo this repo also serves.
 */

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Focus Realm · Intern Onboarding",
  description: "Internal onboarding for new Focus Realm interns.",
  robots: { index: false, follow: false },
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${inter.variable} fr-root min-h-screen`}
      style={{ fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif" }}
    >
      {children}
    </div>
  );
}
