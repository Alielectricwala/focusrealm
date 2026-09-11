import {
  BedDouble,
  BookOpenCheck,
  ClipboardList,
  FileText,
  GraduationCap,
  Layers,
  LifeBuoy,
  MessageSquare,
  Presentation,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  UtensilsCrossed,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { BadgeTone } from "@/components/ui/kit";
import type {
  BriefAssetKind,
  JobRole,
  PhaseKey,
  Status,
  TaskFlag,
} from "./types";

/**
 * The four-state colour system. Classes are written out in full so Tailwind's
 * scanner keeps them.
 */
export const STATUS: Record<
  Status,
  {
    solid: string;
    tint: string;
    text: string;
    ring: string;
    label: string;
    badge: BadgeTone;
  }
> = {
  urgent: {
    solid: "bg-rose-600",
    tint: "bg-rose-50",
    text: "text-rose-700",
    ring: "ring-rose-100",
    label: "Due next",
    badge: "critical",
  },
  active: {
    solid: "bg-gold-500",
    tint: "bg-gold-50",
    text: "text-gold-600",
    ring: "ring-gold-100",
    label: "In progress",
    badge: "gold",
  },
  complete: {
    solid: "bg-emerald-600",
    tint: "bg-emerald-50",
    text: "text-emerald-700",
    ring: "ring-emerald-100",
    label: "Released",
    badge: "positive",
  },
  scheduled: {
    solid: "bg-navy-600",
    tint: "bg-canvas",
    text: "text-ink-500",
    ring: "ring-line",
    label: "Scheduled",
    badge: "neutral",
  },
};

export const PHASE_LABEL: Record<PhaseKey, string> = {
  prepare: "Prepare",
  perform: "Perform",
  verify: "Verify",
  release: "Release",
};

export const PHASE_ORDER: PhaseKey[] = ["prepare", "perform", "verify", "release"];

/** Guest and service conditions, worn as chips on the task card. */
export const FLAG: Record<TaskFlag, { label: string; className: string }> = {
  vip: { label: "VIP", className: "bg-gold-50 text-gold-600 ring-gold-100" },
  "family-arrival": {
    label: "Family arrival",
    className: "bg-sky-50 text-sky-700 ring-sky-100",
  },
  "late-arrival": {
    label: "Late arrival",
    className: "bg-indigo-50 text-indigo-700 ring-indigo-100",
  },
  "early-arrival": {
    label: "Early arrival",
    className: "bg-teal-50 text-teal-700 ring-teal-100",
  },
  "do-not-enter": {
    label: "Do not enter",
    className: "bg-rose-50 text-rose-700 ring-rose-100",
  },
  allergy: { label: "Allergy", className: "bg-amber-50 text-amber-800 ring-amber-100" },
};

export const JOB_ROLE_ICON: Record<JobRole, LucideIcon> = {
  "room-attendant": BedDouble,
  "front-office": ClipboardList,
  "food-beverage": UtensilsCrossed,
  engineering: Wrench,
  security: ShieldCheck,
};

export const ASSET_ICON: Record<BriefAssetKind, LucideIcon> = {
  pdf: FileText,
  video: Presentation,
  deck: Layers,
};

export const SECTION_ICON = {
  courses: GraduationCap,
  paths: BookOpenCheck,
  forums: MessageSquare,
  feedback: Send,
  notifications: Sparkles,
  recovery: LifeBuoy,
  star: Star,
} satisfies Record<string, LucideIcon>;
