import {
  BookMarked,
  CalendarClock,
  GraduationCap,
  Star,
  Sun,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  /** Shortened for the mobile bottom bar. */
  short: string;
  Icon: LucideIcon;
  /** Extra routes that should keep this item highlighted. */
  matches?: string[];
}

/** The five primary staff sections. */
export const NAV: NavItem[] = [
  { href: "/", label: "Today", short: "Today", Icon: Sun },
  { href: "/shift", label: "My shift", short: "Shift", Icon: CalendarClock, matches: ["/handover"] },
  { href: "/library", label: "SOPs", short: "SOPs", Icon: BookMarked, matches: ["/sop"] },
  {
    href: "/courses",
    label: "Courses",
    short: "Courses",
    Icon: GraduationCap,
    matches: ["/paths", "/forums", "/feedback", "/notifications"],
  },
  { href: "/progress", label: "Service record", short: "Record", Icon: Star },
];

/** Sub-navigation that lives inside the Courses section. */
export const COURSE_SUBNAV = [
  { href: "/courses", label: "Courses" },
  { href: "/paths", label: "Paths" },
  { href: "/forums", label: "Forums" },
  { href: "/feedback", label: "Feedback" },
  { href: "/notifications", label: "Notifications" },
];

export function isActive(pathname: string, item: NavItem): boolean {
  const hrefs = [item.href, ...(item.matches ?? [])];
  return hrefs.some((href) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`),
  );
}
