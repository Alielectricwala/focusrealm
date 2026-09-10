import { clientIp, error, json } from "@/lib/onboarding/api.server";
import { getCandidateByToken, updateCandidate } from "@/lib/onboarding/store.server";
import { buildContract, contractToText } from "@/lib/onboarding/contract";
import { currentStage, toCandidateView } from "@/lib/onboarding/stage";
import type { Signature } from "@/lib/onboarding/types";

/** The agreement, generated from the candidate's own submitted details. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  const candidate = await getCandidateByToken(token);
  if (!candidate) return error("This onboarding link is not valid.", 404);

  const stage = currentStage(candidate);
  if (stage === "details" || stage === "learning" || stage === "tests") {
    return error("Your agreement is prepared once both assessments are passed.", 409);
  }

  const contract = buildContract(candidate);
  if (!contract) return error("Could not prepare the agreement.", 500);

  return json({ contract, signature: candidate.signature ?? null });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  const candidate = await getCandidateByToken(token);
  if (!candidate) return error("This onboarding link is not valid.", 404);
  if (candidate.signature) return error("This agreement is already signed.", 409);
  if (currentStage(candidate) !== "contract") {
    return error("Pass both assessments before signing.", 409);
  }

  const body = (await request.json().catch(() => null)) as
    | { typedName?: string; affirmed?: boolean }
    | null;

  const typedName = body?.typedName?.trim();
  if (!typedName) return error("Type your full name to sign.");
  if (body?.affirmed !== true) return error("Confirm the declaration before signing.");

  // Guards against signing with someone else's name, ignoring case and spacing.
  const normalise = (value: string) => value.toLowerCase().replace(/\s+/g, " ").trim();
  if (normalise(typedName) !== normalise(candidate.details!.fullName)) {
    return error("The typed name must match the full name you submitted.");
  }

  const contract = buildContract(candidate);
  if (!contract) return error("Could not prepare the agreement.", 500);

  const signature: Signature = {
    typedName,
    affirmed: true,
    signedAt: new Date().toISOString(),
    ip: clientIp(request),
    userAgent: request.headers.get("user-agent"),
    contractSnapshot: contractToText(contract),
  };

  const updated = await updateCandidate(candidate.id, (c) => ({
    ...c,
    signature,
    // A fresh signature clears any earlier rejection note.
    contractRejection: undefined,
  }));
  if (!updated) return error("Could not record your signature.", 500);

  return json(toCandidateView(updated));
}
