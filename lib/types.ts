/**
 * Domain model for the Mise Staff role.
 *
 * The staff surface is built around one persona working one shift: their duty
 * plan, the standards behind each task, the briefs that teach them, and the
 * service record those completions feed.
 */

export type RoleKey = "staff" | "manager" | "author";

export type JobRole =
  | "room-attendant"
  | "front-office"
  | "food-beverage"
  | "engineering"
  | "security";

/** Four-state colour system used across cards, chips and timelines. */
export type Status = "urgent" | "active" | "complete" | "scheduled";

/** Every standard runs through the same four phases. */
export type PhaseKey = "prepare" | "perform" | "verify" | "release";

/** Guest and service conditions that change how a room is worked. */
export type TaskFlag =
  | "vip"
  | "family-arrival"
  | "late-arrival"
  | "do-not-enter"
  | "early-arrival"
  | "allergy";

export interface StaffProfile {
  name: string;
  title: string;
  jobRole: JobRole;
  department: string;
  property: string;
  shiftLabel: string;
  shiftDay: string;
  initials: string;
}

export interface Supervisor {
  name: string;
  title: string;
  initials: string;
  onShift: boolean;
}

export interface SopStep {
  id: string;
  text: string;
  /** Short callout explaining the consequence of skipping the step. */
  why?: string;
  /** Label for the demo clip attached to this step. */
  clip?: string;
  /** Steps that require photo evidence before the phase can close. */
  photo?: boolean;
}

export interface SopPhase {
  key: PhaseKey;
  steps: SopStep[];
}

export interface Sop {
  id: string;
  code: string;
  title: string;
  jobRole: JobRole;
  hashtags: string[];
  /** Minutes to read the standard. */
  readMinutes: number;
  /** Minutes the task itself should take on the floor. */
  targetMinutes: number;
  summary: string;
  qualityScore: number;
  usageCount: number;
  phases: SopPhase[];
}

export interface ShiftTask {
  id: string;
  room: string;
  sopId: string;
  dueAt: string;
  status: Status;
  flags: TaskFlag[];
  /** The one detail that lifts the room from clean to five-star. */
  fiveStarCue: string;
  /** Seconds left on the clock, for the task currently running. */
  remainingSeconds?: number;
  /** Percent complete, for the task currently running. */
  percent?: number;
}

/** A checkpoint in the shift rhythm — not a room, but a moment in the day. */
export interface ShiftCheckpoint {
  id: string;
  at: string;
  label: string;
  detail: string;
  status: Status;
}

export interface ShiftGlance {
  roomsReleased: number;
  roomsTotal: number;
  onTimePace: number;
  arrivalPressure: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: { id: string; label: string; correct?: boolean }[];
}

export type BriefAssetKind = "pdf" | "video" | "deck";

export interface BriefAsset {
  kind: BriefAssetKind;
  label: string;
  meta: string;
}

/** An operating brief: the teaching layer bundled around a standard. */
export interface Course {
  id: string;
  title: string;
  sopId: string;
  summary: string;
  assets: BriefAsset[];
  readinessCheck: QuizQuestion[];
}

export type PathStepState = "verified" | "active" | "locked";

export interface PathStep {
  id: string;
  title: string;
  sopId: string;
  state: PathStepState;
  /** Who signed the step off, once verified. */
  signedOffBy?: string;
  signedOffAt?: string;
}

export interface LearningPath {
  id: string;
  title: string;
  jobRole: JobRole;
  steps: PathStep[];
}

export interface ForumPost {
  id: string;
  author: string;
  role: "Staff" | "Supervisor";
  initials: string;
  body: string;
  at: string;
}

export interface ForumThread {
  id: string;
  sopId: string;
  question: string;
  posts: ForumPost[];
}

export type NotificationKind = "assignment" | "feedback" | "reminder";
export type NotificationChannel = "in-app" | "email" | "whatsapp";

export interface StaffNotification {
  id: string;
  kind: NotificationKind;
  channels: NotificationChannel[];
  title: string;
  body: string;
  at: string;
  href?: string;
}

export interface Credential {
  id: string;
  title: string;
  code: string;
  verifiedAt: string;
}

export interface ServiceRecord {
  fiveStarScore: number;
  verifiedStandards: number;
  activeStandards: number;
  strengths: string[];
  improvements: string[];
  credentials: Credential[];
}

export interface HandoverItem {
  id: string;
  room: string;
  detail: string;
}

export interface Handover {
  unfinished: HandoverItem[];
  guestPromises: HandoverItem[];
  blockedRooms: HandoverItem[];
  checklist: { id: string; label: string }[];
}

export type RecoveryStepKey = "listen" | "acknowledge" | "resolve" | "follow-up";

export interface RecoveryStep {
  key: RecoveryStepKey;
  title: string;
  prompt: string;
  actions: string[];
}

export interface IncidentEntry {
  id: string;
  at: string;
  actor: string;
  detail: string;
}

export interface ServiceRecovery {
  spendLimit: string;
  currency: string;
  steps: RecoveryStep[];
  timeline: IncidentEntry[];
}
