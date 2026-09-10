import { error, isAdmin } from "@/lib/onboarding/api.server";
import { getCandidate, readUpload } from "@/lib/onboarding/store.server";

/** Streams the uploaded Aadhaar copy. Never cached, admin session required. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) return error("Not authorised.", 401);

  const { id } = await params;
  const candidate = await getCandidate(id);
  const file = candidate?.details?.aadhaarFile;
  if (!file) return error("Not found.", 404);

  const bytes = await readUpload(file.storedAs);
  if (!bytes) return error("That file is missing from the server.", 404);

  return new Response(new Uint8Array(bytes), {
    headers: {
      "content-type": file.mimeType,
      "content-disposition": `inline; filename="aadhaar-${id}"`,
      "cache-control": "private, no-store",
    },
  });
}
