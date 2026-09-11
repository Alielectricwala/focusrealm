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
  /**
   * True only where a reviewed agreement document exists in the repository for
   * this role. Everything else is issued from the standard template with this
   * role's title and duties written in — which the founders have to approve,
   * or replace with a document of their own.
   */
  agreementOnFile?: boolean;
  /** "Marketing" — used in headings and the agreement subtitle. */
  label: string;
  /** "Marketing Intern" — the role title written into the agreement. */
  roleTitle: string;
  /** The duties clause of the agreement, phrased to follow "assisting with". */
  duties: string;
}

/**
 * Only the Founder's Office agreement exists as a reviewed document. For any
 * other role the founders choose, per candidate, between issuing the standard
 * template with that role's title, duties and term written in, or uploading an
 * agreement of their own — the flow will not let a candidate reach a signature
 * until one of those is settled.
 */
export type AgreementPlan =
  | { kind: "standard" }
  | { kind: "bespoke"; document?: StoredFile; uploadedAt?: string };

/** Used when an older record predates the term field, and as the form default. */
export const DEFAULT_TERM_MONTHS = 3;
export const MIN_TERM_MONTHS = 1;
export const MAX_TERM_MONTHS = 24;

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
  /** Captured in the same request that submitted these details. */
  consent: ConsentRecord;
}

/**
 * Proof that consent was given: which notice the candidate read, what they
 * ticked, and when. Kept so the Company can evidence consent under the DPDP
 * Act, and so a change to the notice never rewrites what someone agreed to.
 */
export interface ConsentRecord {
  /** The notice text version in force when consent was given. */
  noticeVersion: string;
  /** Ids from CONSENT_ITEMS — every required one, or the record is not written. */
  acceptedItems: string[];
  at: string;
  ip: string | null;
  userAgent: string | null;
}

/** One founder opening a candidate's Aadhaar copy. Aadhaar access is logged. */
export interface AadhaarAccess {
  at: string;
  ip: string | null;
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
  /** Separate, explicit consent to conclude the agreement electronically. */
  electronicSignatureConsent?: boolean;
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
  /** Length of the engagement in months. Written into the agreement. */
  termMonths: number;
  /** Which agreement this candidate signs, and whether it is ready to sign. */
  agreement: AgreementPlan;
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
  /** Appended each time a founder opens the Aadhaar copy. Newest last. */
  aadhaarAccess?: AadhaarAccess[];
  contractVerifiedAt?: string;
  contractRejection?: { note: string; at: string };
  emailRequestedAt?: string;
  mailbox?: Mailbox;
}

/** Candidate-safe view — no Aadhaar number, no sealed password. */
export interface CandidateView {
  track: InternTrack;
  termMonths: number;
  endDate: string;
  /** "standard" or "bespoke" — the candidate sees which document they sign. */
  agreementKind: AgreementPlan["kind"];
  agreementDocumentName: string | null;
  /** Resolved role — the candidate never needs to know about track ids. */
  role: TrackDefinition;
  invitedName: string;
  startDate: string;
  stage: Stage;
  details: (Omit<CandidateDetails, "aadhaarNumber"> & {
    aadhaarLast4: string;
  }) | null;
  /** So the portal can show the candidate what they agreed to, and when. */
  consent: ConsentRecord | null;
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
    agreementOnFile: true,
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
