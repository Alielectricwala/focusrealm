/**
 * Domain model for the Focus Realm internal intern onboarding module.
 *
 * One candidate moves through a fixed sequence: submit identity, work the
 * handbooks and videos, pass both tests, sign the internship agreement, wait
 * for the founders to verify it, then receive a company mailbox.
 */

/**
 * A track is an internship role. The three below ship with the module; the
 * founders can define any other role when they invite a candidate, in which
 * case the definition travels on the candidate record itself.
 */
export type InternTrack = string;

export interface TrackDefinition {
  id: InternTrack;
  /** "Marketing" — used in headings and the agreement subtitle. */
  label: string;
  /** "Marketing Intern" — the role title written into the agreement. */
  roleTitle: string;
  /** The duties clause of the agreement, phrased to follow "assisting with". */
  duties: string;
}

export type Stage =
  | "details"
  | "learning"
  | "tests"
  | "contract"
  | "verification"
  | "email"
  | "complete";

/** What the candidate submits before anything else can happen. */
export interface CandidateDetails {
  fullName: string;
  /** "son/daughter of" on the agreement. */
  parentName: string;
  /** 12 digits, stored unformatted. Never rendered in full outside admin. */
  aadhaarNumber: string;
  address: string;
  personalEmail: string;
  phone: string;
  aadhaarFile: StoredFile | null;
  submittedAt: string;
}

export interface StoredFile {
  originalName: string;
  mimeType: string;
  bytes: number;
  /** Opaque name on disk. Files live outside the public directory. */
  storedAs: string;
}

export interface TestAttempt {
  attempt: number;
  /** Percent, 0–100. */
  score: number;
  correct: number;
  total: number;
  passed: boolean;
  at: string;
}

export interface Signature {
  typedName: string;
  affirmed: boolean;
  signedAt: string;
  ip: string | null;
  userAgent: string | null;
  /** The exact agreement text the candidate agreed to, frozen at signing. */
  contractSnapshot: string;
}

export interface Mailbox {
  address: string;
  provisionedAt: string;
  /** Set once the candidate has viewed the credentials. */
  viewedAt?: string;
  /**
   * Temporary password, encrypted at rest and destroyed after a single view.
   * Absent once viewed.
   */
  sealedPassword?: string;
}

export interface Candidate {
  id: string;
  /** Unguessable value in the onboarding link. Treat as a bearer credential. */
  token: string;
  track: InternTrack;
  /** Set when the role is not one of the built-in tracks. */
  customTrack?: TrackDefinition;
  /** What we knew at invite time, before the candidate submits anything. */
  invitedName: string;
  invitedEmail: string;
  startDate: string;
  createdAt: string;
  archivedAt?: string;

  details?: CandidateDetails;
  /** Resource id → ISO timestamp the candidate marked it done. */
  resources: Record<string, string>;
  /** Test id → every attempt, oldest first. */
  tests: Record<string, TestAttempt[]>;
  signature?: Signature;
  contractVerifiedAt?: string;
  contractRejection?: { note: string; at: string };
  emailRequestedAt?: string;
  mailbox?: Mailbox;
}

/** Candidate-safe view — no Aadhaar number, no sealed password. */
export interface CandidateView {
  track: InternTrack;
  /** Resolved role — the candidate never needs to know about track ids. */
  role: TrackDefinition;
  invitedName: string;
  startDate: string;
  stage: Stage;
  details: (Omit<CandidateDetails, "aadhaarNumber"> & {
    aadhaarLast4: string;
  }) | null;
  resources: Record<string, string>;
  tests: Record<string, TestAttempt[]>;
  signedAt: string | null;
  contractVerifiedAt: string | null;
  contractRejection: { note: string; at: string } | null;
  emailRequestedAt: string | null;
  mailbox: { address: string; viewed: boolean } | null;
}

export const BUILT_IN_TRACKS: Record<string, TrackDefinition> = {
  "founders-office": {
    id: "founders-office",
    label: "Founder's Office",
    roleTitle: "Founder's Office Intern",
    duties:
      "strategic and research support, cross-functional project work, and operational assistance to the founding team",
  },
  marketing: {
    id: "marketing",
    label: "Marketing",
    roleTitle: "Marketing Intern",
    duties:
      "content production, campaign support, research, and marketing operations assistance to the founding team",
  },
  "business-development": {
    id: "business-development",
    label: "Business Development",
    roleTitle: "Business Development Intern",
    duties:
      "lead research and sourcing, outreach support, pipeline maintenance, and commercial research assistance to the founding team",
  },
};

/** @deprecated Prefer `trackOf` — a candidate's track may be a custom role. */
export const TRACK_LABEL: Record<string, string> = Object.fromEntries(
  Object.values(BUILT_IN_TRACKS).map((track) => [track.id, track.label]),
);

/**
 * The role this candidate was invited for. Built-in tracks resolve from the
 * table above; a custom role carries its own definition, frozen on the record
 * at invite time so an edit later cannot rewrite an agreement already signed.
 */
export function trackOf(candidate: {
  track: InternTrack;
  customTrack?: TrackDefinition;
}): TrackDefinition {
  return (
    candidate.customTrack ??
    BUILT_IN_TRACKS[candidate.track] ?? {
      id: candidate.track,
      label: candidate.track,
      roleTitle: `${candidate.track} Intern`,
      duties: "the duties agreed with the founding team at the start of the engagement",
    }
  );
}

/** Turns a typed role name into a stable id. */
export function trackIdFromLabel(label: string): string {
  return (
    label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "custom-role"
  );
}

export const STAGE_ORDER: Stage[] = [
  "details",
  "learning",
  "tests",
  "contract",
  "verification",
  "email",
  "complete",
];

export const STAGE_LABEL: Record<Stage, string> = {
  details: "Your details",
  learning: "Handbooks & videos",
  tests: "Assessments",
  contract: "Internship agreement",
  verification: "Under review",
  email: "Company email",
  complete: "Onboarded",
};
