import { error, isAdmin, json } from "@/lib/onboarding/api.server";
import { createCandidate, listCandidates } from "@/lib/onboarding/store.server";
import { currentStage } from "@/lib/onboarding/stage";
import { maskAadhaar } from "@/lib/onboarding/security.server";
import type { InternTrack } from "@/lib/onboarding/types";

const TRACKS: InternTrack[] = ["founders-office", "marketing", "business-development"];

/** Summary rows for the console. Full Aadhaar numbers never appear in the list. */
export async function GET() {
  if (!(await isAdmin())) return error("Not authorised.", 401);

  const candidates = await listCandidates();

  return json(
    candidates.map((c) => ({
      id: c.id,
      token: c.token,
      invitedName: c.invitedName,
      invitedEmail: c.invitedEmail,
      track: c.track,
      startDate: c.startDate,
      createdAt: c.createdAt,
      stage: currentStage(c),
      fullName: c.details?.fullName ?? null,
      aadhaarMasked: c.details ? maskAadhaar(c.details.aadhaarNumber) : null,
      signedAt: c.signature?.signedAt ?? null,
      contractVerifiedAt: c.contractVerifiedAt ?? null,
      emailRequestedAt: c.emailRequestedAt ?? null,
      mailbox: c.mailbox?.address ?? null,
      tests: c.tests,
    })),
  );
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return error("Not authorised.", 401);

  const body = (await request.json().catch(() => null)) as {
    invitedName?: string;
    invitedEmail?: string;
    track?: string;
    startDate?: string;
  } | null;

  const invitedName = body?.invitedName?.trim();
  const invitedEmail = body?.invitedEmail?.trim();
  const track = body?.track;
  const startDate = body?.startDate;

  if (!invitedName || !invitedEmail || !track || !startDate) {
    return error("Name, email, track and start date are all required.");
  }
  if (!TRACKS.includes(track as InternTrack)) return error("Unknown track.");
  if (Number.isNaN(Date.parse(startDate))) return error("Start date is not a valid date.");

  const candidate = await createCandidate({
    invitedName,
    invitedEmail,
    track: track as InternTrack,
    startDate: new Date(startDate).toISOString(),
  });

  return json({ id: candidate.id, token: candidate.token }, 201);
}
