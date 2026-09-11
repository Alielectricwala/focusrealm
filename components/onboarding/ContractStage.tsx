"use client";

import { useEffect, useState } from "react";
import { Clock, FileSignature, Printer } from "lucide-react";
import type { Contract } from "@/lib/onboarding/contract";
import type { CandidateView, Signature } from "@/lib/onboarding/types";
import ContractDocument from "./ContractDocument";
import { SIGNING_CONSENT } from "@/lib/onboarding/compliance";
import { Button, Card, Field, Notice, SectionTitle, formatDateTime, inputClass, inputStyle } from "./ui";

/** Steps four and five: review and sign, then wait for the founders to verify. */
export default function ContractStage({
  token,
  candidate,
  onSaved,
  locked,
}: {
  token: string;
  candidate: CandidateView;
  onSaved: (next: CandidateView) => void;
  locked: boolean;
}) {
  const [contract, setContract] = useState<Contract | null>(null);
  const [signature, setSignature] = useState<Signature | null>(null);
  const [typedName, setTypedName] = useState("");
  const [affirmed, setAffirmed] = useState(false);
  const [signingConsent, setSigningConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (locked) return;

    let cancelled = false;
    fetch(`/api/onboarding/session/${token}/contract`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        setContract(data.contract as Contract);
        setSignature(data.signature as Signature | null);
      });

    return () => {
      cancelled = true;
    };
  }, [token, locked, candidate.signedAt]);

  if (locked) {
    return (
      <Card>
        <SectionTitle
          eyebrow="Step 4 of 6"
          title="Internship agreement"
          lead="Your agreement is drawn up automatically from the details you submitted, and opens as soon as both assessments are passed."
        />
        <Notice tone="warn">Pass both assessments to unlock your agreement.</Notice>
      </Card>
    );
  }

  async function sign() {
    setBusy(true);
    setMessage(null);

    const response = await fetch(`/api/onboarding/session/${token}/contract`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        typedName,
        affirmed,
        electronicSignatureConsent: signingConsent,
      }),
    });
    const data = await response.json();
    setBusy(false);

    if (!response.ok) {
      setMessage(data.error ?? "Could not sign.");
      return;
    }
    onSaved(data as CandidateView);
  }

  const isSigned = Boolean(candidate.signedAt);
  const isVerified = Boolean(candidate.contractVerifiedAt);

  return (
    <div className="space-y-5">
      <Card>
        <SectionTitle
          eyebrow={isSigned ? (isVerified ? "Step 4 · Verified" : "Step 5 · Under review") : "Step 4 of 6"}
          title="Internship agreement"
          lead={
            isVerified
              ? "Signed and verified by the founders. Your copy is below — print or save it for your records."
              : isSigned
                ? "Signed. The founders verify it from their side, usually within a working day. You will be able to request your company email once they do."
                : "Generated from the details you submitted. Read it in full, then sign at the bottom."
          }
        />

        {candidate.contractRejection && (
          <div className="mb-5">
            <Notice tone="bad">
              Sent back on {formatDateTime(candidate.contractRejection.at)}:{" "}
              {candidate.contractRejection.note}
            </Notice>
          </div>
        )}

        {isSigned && !isVerified && (
          <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ backgroundColor: "rgba(201,162,39,0.10)" }}>
            <Clock className="size-5 shrink-0" style={{ color: "var(--fr-gold)" }} aria-hidden />
            <p className="text-sm" style={{ color: "var(--fr-muted)" }}>
              Signed {candidate.signedAt ? formatDateTime(candidate.signedAt) : ""} — awaiting
              verification.
            </p>
          </div>
        )}

        {isSigned && (
          <div className="mt-4">
            <Button variant="ghost" onClick={() => window.print()}>
              <Printer className="size-4" aria-hidden />
              Print or save as PDF
            </Button>
          </div>
        )}
      </Card>

      {contract && <ContractDocument contract={contract} signature={signature} />}

      {contract && !isSigned && (
        <Card>
          <SectionTitle
            title="Sign the agreement"
            lead="Typing your name below is your electronic signature. It is recorded with the time and your IP address."
          />

          <div className="space-y-5">
            <Field label="Type your full name" hint={`Must match "${contract.fields.fullName}".`}>
              <input
                value={typedName}
                onChange={(e) => setTypedName(e.target.value)}
                className={inputClass}
                style={inputStyle}
                autoComplete="off"
              />
            </Field>

            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={affirmed}
                onChange={(e) => setAffirmed(e.target.checked)}
                className="mt-1 size-4 shrink-0 accent-[var(--fr-gold)]"
              />
              <span className="text-sm leading-snug text-pretty">
                I have read this agreement in full, the details in it are mine and correct, and I
                accept its terms.
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={signingConsent}
                onChange={(e) => setSigningConsent(e.target.checked)}
                className="mt-1 size-4 shrink-0 accent-[var(--fr-gold)]"
              />
              <span className="min-w-0">
                <span className="block text-sm leading-snug text-pretty">
                  {SIGNING_CONSENT.label}
                </span>
                {SIGNING_CONSENT.detail && (
                  <span
                    className="mt-1 block text-xs leading-relaxed"
                    style={{ color: "var(--fr-muted)" }}
                  >
                    {SIGNING_CONSENT.detail}
                  </span>
                )}
              </span>
            </label>

            {message && <Notice tone="bad">{message}</Notice>}

            <Button
              disabled={busy || !typedName.trim() || !affirmed || !signingConsent}
              onClick={sign}
            >
              <FileSignature className="size-4" aria-hidden />
              {busy ? "Signing…" : "Sign agreement"}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
