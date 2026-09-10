/**
 * Domain model for the Focus Realm internal intern onboarding module.
 *
 * One candidate moves through a fixed sequence: submit identity, work the
 * handbooks and videos, pass both tests, sign the internship agreement, wait
 * for the founders to verify it, then receive a company mailbox.
 */

export type InternTrack =
  | "founders-office"
  | "marketing"
  | "business-development";

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

export const TRACK_LABEL: Record<InternTrack, string> = {
  "founders-office": "Founder's Office",
  marketing: "Marketing",
  "business-development": "Business Development",
};

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
