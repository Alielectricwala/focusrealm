import { RESOURCES } from "./content";
import type { Candidate, CandidateView, Stage } from "./types";
import { STAGE_ORDER, trackOf } from "./types";

/** Test ids, duplicated from tests.server so client code can count passes. */
export const TEST_IDS = ["test-focus-realm", "test-recharga"] as const;

export function hasPassed(candidate: Candidate, testId: string): boolean {
  return (candidate.tests[testId] ?? []).some((a) => a.passed);
}

export function bestScore(candidate: Candidate, testId: string): number | null {
  const attempts = candidate.tests[testId] ?? [];
  return attempts.length ? Math.max(...attempts.map((a) => a.score)) : null;
}

export function resourcesDone(candidate: Candidate): number {
  return RESOURCES.filter((r) => candidate.resources[r.id]).length;
}

/**
 * The single source of truth for where a candidate is. Derived rather than
 * stored, so a record can never drift out of sync with its own contents.
 */
export function currentStage(candidate: Candidate): Stage {
  if (!candidate.details) return "details";
  if (resourcesDone(candidate) < RESOURCES.length) return "learning";
  if (!TEST_IDS.every((id) => hasPassed(candidate, id))) return "tests";
  if (!candidate.signature) return "contract";
  if (!candidate.contractVerifiedAt) return "verification";
  if (!candidate.mailbox) return "email";
  return "complete";
}

export function stageIndex(stage: Stage): number {
  return STAGE_ORDER.indexOf(stage);
}

export function isStageDone(candidate: Candidate, stage: Stage): boolean {
  return stageIndex(currentStage(candidate)) > stageIndex(stage);
}

/** Strips Aadhaar number and sealed credentials for the candidate's own view. */
export function toCandidateView(candidate: Candidate): CandidateView {
  const { details } = candidate;

  return {
    track: candidate.track,
    role: trackOf(candidate),
    invitedName: candidate.invitedName,
    startDate: candidate.startDate,
    stage: currentStage(candidate),
    details: details
      ? {
          fullName: details.fullName,
          parentName: details.parentName,
          address: details.address,
          personalEmail: details.personalEmail,
          phone: details.phone,
          aadhaarFile: details.aadhaarFile,
          submittedAt: details.submittedAt,
          aadhaarLast4: details.aadhaarNumber.slice(-4),
        }
      : null,
    resources: candidate.resources,
    tests: candidate.tests,
    signedAt: candidate.signature?.signedAt ?? null,
    contractVerifiedAt: candidate.contractVerifiedAt ?? null,
    contractRejection: candidate.contractRejection ?? null,
    emailRequestedAt: candidate.emailRequestedAt ?? null,
    mailbox: candidate.mailbox
      ? {
          address: candidate.mailbox.address,
          viewed: Boolean(candidate.mailbox.viewedAt),
        }
      : null,
  };
}
