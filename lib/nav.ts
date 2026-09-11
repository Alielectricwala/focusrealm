import {
  BookMarked,
  CalendarClock,
  GraduationCap,
  LifeBuoy,
  MessageSquare,
  Route,
  Send,
  Star,
  Sun,
  ClipboardSignature,
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

export interface NavGroup {
  label: string;
  items: NavItem[];
}

/** The five primary staff sections — the mobile bottom bar. */
export const NAV: NavItem[] = [
  { href: "/", label: "Today", short: "Today", Icon: Sun },
  {
    href: "/shift",
    label: "My shift",
    short: "Shift",
    Icon: CalendarClock,
    matches: ["/handover"],
  },
  { href: "/library", label: "Standards", short: "SOPs", Icon: BookMarked, matches: ["/sop"] },
  {
    href: "/courses",
    label: "Courses",
    short: "Courses",
    Icon: GraduationCap,
    matches: ["/paths", "/forums", "/feedback", "/notifications"],
  },
  { href: "/progress", label: "Service record", short: "Record", Icon: Star },
];

/**
 * The desktop sidebar groups the same routes the way an operations console
 * does — by what the person is doing, not by page count.
 */
export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Operations",
    items: [
      { href: "/", label: "Today", short: "Today", Icon: Sun },
      { href: "/shift", label: "My shift", short: "Shift", Icon: CalendarClock },
      {
        href: "/handover",
        label: "Handover",
        short: "Handover",
        Icon: ClipboardSignature,
      },
      {
        href: "/service-recovery",
        label: "Service recovery",
        short: "Recovery",
        Icon: LifeBuoy,
      },
    ],
  },
  {
    label: "Standards",
    items: [
      {
        href: "/library",
        label: "SOP library",
        short: "SOPs",
        Icon: BookMarked,
        matches: ["/sop"],
      },
    ],
  },
  {
    label: "Enablement",
    items: [
      { href: "/courses", label: "Courses", short: "Courses", Icon: GraduationCap },
      { href: "/paths", label: "Learning paths", short: "Paths", Icon: Route },
      { href: "/forums", label: "Forums", short: "Forums", Icon: MessageSquare },
      { href: "/feedback", label: "Feedback", short: "Feedback", Icon: Send },
    ],
  },
  {
    label: "Performance",
    items: [
      { href: "/progress", label: "Service record", short: "Record", Icon: Star },
    ],
  },
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

const CRUMB: Record<string, string> = {
  "": "Today",
  shift: "My shift",
  handover: "Shift handover",
  library: "SOP library",
  sop: "Standard",
  practice: "Guided run",
  courses: "Courses",
  paths: "Learning paths",
  forums: "Forums",
  feedback: "Feedback",
  notifications: "Notifications",
  progress: "Service record",
  "service-recovery": "Service recovery",
};

/** Breadcrumb trail for the console top bar. */
export function crumbsFor(pathname: string): { label: string; href: string }[] {
  const segments = pathname.split("/").filter(Boolean);
  const trail = [{ label: "Today", href: "/" }];

  segments.forEach((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const known = CRUMB[segment];
    // Ids (sop/hsk-101) read better upper-cased than title-cased.
    trail.push({ label: known ?? segment.toUpperCase(), href });
  });

  return trail;
}
