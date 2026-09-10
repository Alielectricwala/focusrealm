import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { error, json } from "@/lib/onboarding/api.server";
import { getResource } from "@/lib/onboarding/content";
import { getCandidateByToken, updateCandidate } from "@/lib/onboarding/store.server";
import { toCandidateView } from "@/lib/onboarding/stage";

/**
 * Handbooks are internal documents, so they stream through this token-gated
 * route rather than sitting in public/.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string; resourceId: string }> },
) {
  const { token, resourceId } = await params;

  const candidate = await getCandidateByToken(token);
  if (!candidate) return error("This onboarding link is not valid.", 404);

  const resource = getResource(resourceId);
  if (!resource?.file) return error("Not found.", 404);

  try {
    const bytes = await readFile(join(process.cwd(), "content", "onboarding", resource.file));
    return new Response(new Uint8Array(bytes), {
      headers: {
        "content-type": "application/pdf",
        "content-disposition": `inline; filename="${resource.id}.pdf"`,
        "cache-control": "private, no-store",
      },
    });
  } catch {
    return error("That document is missing from the server.", 500);
  }
}

/** Marks a handbook read or a video watched. */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ token: string; resourceId: string }> },
) {
  const { token, resourceId } = await params;

  const candidate = await getCandidateByToken(token);
  if (!candidate) return error("This onboarding link is not valid.", 404);
  if (!getResource(resourceId)) return error("Not found.", 404);

  const updated = await updateCandidate(candidate.id, (c) => ({
    ...c,
    resources: { ...c.resources, [resourceId]: new Date().toISOString() },
  }));
  if (!updated) return error("Could not save your progress.", 500);

  return json(toCandidateView(updated));
}
