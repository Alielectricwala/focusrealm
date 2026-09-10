import { error, json, requiredString } from "@/lib/onboarding/api.server";
import { getCandidateByToken, saveUpload, updateCandidate } from "@/lib/onboarding/store.server";
import { isValidAadhaar, normaliseAadhaar } from "@/lib/onboarding/security.server";
import { toCandidateView } from "@/lib/onboarding/stage";
import type { CandidateDetails } from "@/lib/onboarding/types";

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const candidate = await getCandidateByToken(token);
  if (!candidate) return error("This onboarding link is not valid.", 404);
  if (candidate.details) return error("Your details have already been submitted.", 409);

  const form = await request.formData();

  const fullName = requiredString(form.get("fullName"), 120);
  const parentName = requiredString(form.get("parentName"), 120);
  const address = requiredString(form.get("address"), 600);
  const personalEmail = requiredString(form.get("personalEmail"), 200);
  const phone = requiredString(form.get("phone"), 32);
  const aadhaarRaw = requiredString(form.get("aadhaarNumber"), 32);

  if (!fullName || !parentName || !address || !personalEmail || !phone || !aadhaarRaw) {
    return error("Every field is required.");
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(personalEmail)) {
    return error("That email address does not look right.");
  }

  const aadhaarNumber = normaliseAadhaar(aadhaarRaw);
  if (!isValidAadhaar(aadhaarNumber)) {
    return error("An Aadhaar number is 12 digits.");
  }

  const file = form.get("aadhaarFile");
  if (!(file instanceof File) || file.size === 0) {
    return error("Attach a copy of your Aadhaar card.");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return error("That file is larger than 8 MB. Attach a smaller scan or photo.");
  }
  if (!ACCEPTED.includes(file.type)) {
    return error("Attach a JPG, PNG, WebP or PDF.");
  }

  const { storedAs, bytes } = await saveUpload(file);

  const details: CandidateDetails = {
    fullName,
    parentName,
    aadhaarNumber,
    address,
    personalEmail,
    phone,
    aadhaarFile: {
      originalName: file.name,
      mimeType: file.type,
      bytes,
      storedAs,
    },
    submittedAt: new Date().toISOString(),
  };

  const updated = await updateCandidate(candidate.id, (c) => ({ ...c, details }));
  if (!updated) return error("Could not save your details.", 500);

  return json(toCandidateView(updated));
}
