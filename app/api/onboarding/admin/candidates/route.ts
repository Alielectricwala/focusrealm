import { error, isAdmin, json } from "@/lib/onboarding/api.server";
import { createCandidate, listCandidates } from "@/lib/onboarding/store.server";
import { currentStage } from "@/lib/onboarding/stage";
import { maskAadhaar } from "@/lib/onboarding/security.server";
import { BUILT_IN_TRACKS, trackIdFromLabel, trackOf } from "@/lib/onboarding/types";
import type { TrackDefinition } from "@/lib/onboarding/types";

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
      role: trackOf(c),
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
    /** Sent instead of a built-in track id when the founders define a role. */
    customRole?: { label?: string; roleTitle?: string; duties?: string };
  } | null;

  const invitedName = body?.invitedName?.trim();
  const invitedEmail = body?.invitedEmail?.trim();
  const track = body?.track;
  const startDate = body?.startDate;

  if (!invitedName || !invitedEmail || !track || !startDate) {
    return error("Name, email, track and start date are all required.");
  }
  if (Number.isNaN(Date.parse(startDate))) return error("Start date is not a valid date.");

  /*
   * A role is either one of the built-in tracks or one the founders define
   * here. A custom role is frozen onto the candidate record at invite time, so
   * the agreement a candidate signs can never be rewritten by a later edit.
   */
  let customTrack: TrackDefinition | undefined;

  if (track === "custom") {
    const label = body?.customRole?.label?.trim();
    const roleTitle = body?.customRole?.roleTitle?.trim();
    const duties = body?.customRole?.duties?.trim();

    if (!label || !roleTitle || !duties) {
      return error(
        "A custom role needs a name, the role title for the agreement, and the duties clause.",
      );
    }
    if (label.length > 60 || roleTitle.length > 80 || duties.length > 600) {
      return error("That custom role is too long — shorten the name, title or duties.");
    }

    const id = trackIdFromLabel(label);
    if (BUILT_IN_TRACKS[id]) {
      return error(`"${label}" is already a standard track — pick it from the list instead.`);
    }
    customTrack = { id, label, roleTitle, duties };
  } else if (!BUILT_IN_TRACKS[track]) {
    return error("Unknown track.");
  }

  const candidate = await createCandidate({
    invitedName,
    invitedEmail,
    track: customTrack ? customTrack.id : track,
    customTrack,
    startDate: new Date(startDate).toISOString(),
  });

  return json({ id: candidate.id, token: candidate.token }, 201);
}
