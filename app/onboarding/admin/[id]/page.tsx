"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, ExternalLink, Mail, X } from "lucide-react";
import ContractDocument from "@/components/onboarding/ContractDocument";
import {
  Button,
  Card,
  Field,
  Notice,
  SectionTitle,
  Wordmark,
  formatDate,
  formatDateTime,
  inputClass,
  inputStyle,
} from "@/components/onboarding/ui";
import type { Contract } from "@/lib/onboarding/contract";
import { STAGE_LABEL, TRACK_LABEL, type Candidate, type Stage } from "@/lib/onboarding/types";

interface AdminCandidate extends Omit<Candidate, "mailbox"> {
  stage: Stage;
  aadhaarFormatted: string | null;
  contract: Contract | null;
  mailbox: {
    address: string;
    provisionedAt: string;
    viewedAt: string | null;
    collected: boolean;
  } | null;
}

/** One candidate: their documents, and the decisions only a founder can make. */
export default function AdminCandidatePage() {
  const { id } = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<AdminCandidate | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [issued, setIssued] = useState<{ address: string; password: string } | null>(null);

  const load = useCallback(
    () =>
      fetch(`/api/onboarding/admin/candidates/${id}`)
        .then(async (response) => {
          if (response.ok) setCandidate((await response.json()) as AdminCandidate);
        })
        .catch(() => {}),
    [id],
  );

  useEffect(() => {
    load();
  }, [load]);

  async function act(payload: Record<string, unknown>) {
    setMessage(null);
    const response = await fetch(`/api/onboarding/admin/candidates/${id}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? "Could not complete that.");
      return null;
    }
    await load();
    return data;
  }

  if (!candidate) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-12">
        <p style={{ color: "var(--fr-muted)" }}>Loading…</p>
      </div>
    );
  }

  const { details } = candidate;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <Wordmark subtitle="Onboarding console" />
        <Link
          href="/onboarding/admin"
          className="inline-flex min-h-10 items-center gap-2 text-sm font-bold"
          style={{ color: "var(--fr-muted)" }}
        >
          <ArrowLeft className="size-4" aria-hidden />
          All candidates
        </Link>
      </div>

      <header className="mb-6">
        <h1 className="text-2xl leading-tight font-bold text-balance">
          {details?.fullName ?? candidate.invitedName}
        </h1>
        <p className="mt-1.5 text-sm" style={{ color: "var(--fr-muted)" }}>
          {TRACK_LABEL[candidate.track]} · starts {formatDate(candidate.startDate)} · currently at{" "}
          <span style={{ color: "var(--fr-gold-soft)" }}>{STAGE_LABEL[candidate.stage]}</span>
        </p>
      </header>

      {message && (
        <div className="mb-5">
          <Notice tone="bad">{message}</Notice>
        </div>
      )}

      <div className="space-y-5">
        <Card>
          <SectionTitle title="Onboarding link" />
          <p
            className="rounded-xl border p-3 font-mono text-xs break-all"
            style={{ borderColor: "var(--fr-line)", backgroundColor: "var(--fr-navy-deep)" }}
          >
            /onboarding/{candidate.token}
          </p>
        </Card>

        {details ? (
          <Card>
            <SectionTitle
              title="Submitted details"
              lead={`Received ${formatDateTime(details.submittedAt)}.`}
            />
            <dl className="grid gap-4 sm:grid-cols-2">
              <Detail label="Full name" value={details.fullName} />
              <Detail label="Son / daughter of" value={details.parentName} />
              <Detail label="Aadhaar number" value={candidate.aadhaarFormatted ?? "—"} />
              <Detail label="Phone" value={details.phone} />
              <Detail label="Email" value={details.personalEmail} />
              <div className="sm:col-span-2">
                <Detail label="Address" value={details.address} />
              </div>
            </dl>

            {details.aadhaarFile && (
              <a
                href={`/api/onboarding/admin/candidates/${id}/aadhaar`}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-xl px-4 text-sm font-bold"
                style={{
                  backgroundColor: "var(--fr-navy-soft)",
                  border: "1px solid var(--fr-line)",
                  color: "var(--fr-paper)",
                }}
              >
                Open Aadhaar copy ({details.aadhaarFile.originalName})
                <ExternalLink className="size-4" aria-hidden />
              </a>
            )}
          </Card>
        ) : (
          <Card>
            <SectionTitle title="Submitted details" />
            <Notice>Nothing submitted yet.</Notice>
          </Card>
        )}

        <Card>
          <SectionTitle title="Assessments" lead="Pass mark is 75% on each, judged separately." />
          <ul className="space-y-2">
            {Object.entries(candidate.tests).map(([testId, attempts]) => {
              const best = Math.max(...attempts.map((a) => a.score));
              const passed = attempts.some((a) => a.passed);
              return (
                <li key={testId} className="flex flex-wrap items-center justify-between gap-3 text-sm">
                  <span className="font-bold">{testId}</span>
                  <span style={{ color: passed ? "var(--fr-gold-soft)" : "var(--fr-muted)" }}>
                    {attempts.length} attempt{attempts.length === 1 ? "" : "s"} · best {best}% ·{" "}
                    {passed ? "passed" : "not passed"}
                  </span>
                </li>
              );
            })}
            {Object.keys(candidate.tests).length === 0 && (
              <li style={{ color: "var(--fr-muted)" }}>No attempts yet.</li>
            )}
          </ul>
        </Card>

        {candidate.signature && (
          <>
            <Card>
              <SectionTitle
                title="Signed agreement"
                lead={`Signed by ${candidate.signature.typedName} on ${formatDateTime(
                  candidate.signature.signedAt,
                )}${candidate.signature.ip ? ` from ${candidate.signature.ip}` : ""}.`}
              />

              {candidate.contractVerifiedAt ? (
                <Notice tone="good">
                  Verified {formatDateTime(candidate.contractVerifiedAt)}.
                </Notice>
              ) : (
                <VerifyActions
                  onVerify={() => act({ action: "verify" })}
                  onReject={(note) => act({ action: "reject", note })}
                />
              )}
            </Card>

            {candidate.contract && (
              <ContractDocument contract={candidate.contract} signature={candidate.signature} />
            )}
          </>
        )}

        {candidate.contractVerifiedAt && (
          <Card>
            <SectionTitle
              title="Company mailbox"
              lead={
                candidate.emailRequestedAt
                  ? `Requested ${formatDateTime(candidate.emailRequestedAt)}.`
                  : "The candidate has not requested one yet."
              }
            />

            {/* `issued` wins over the refreshed record — this is the only time
                the operator gets to see the password they must set. */}
            {issued ? (
              <div className="space-y-3">
                <Notice tone="good">
                  Recorded. Create this mailbox in SpaceMail with exactly this password — the
                  candidate sees it once, on their own page.
                </Notice>
                <dl className="space-y-2 text-sm">
                  <Detail label="Address" value={issued.address} />
                  <Detail label="Password" value={issued.password} />
                </dl>
              </div>
            ) : candidate.mailbox ? (
              <div className="space-y-2 text-sm">
                <p className="font-bold">{candidate.mailbox.address}</p>
                <p style={{ color: "var(--fr-muted)" }}>
                  Created {formatDateTime(candidate.mailbox.provisionedAt)} ·{" "}
                  {candidate.mailbox.collected
                    ? `password collected${
                        candidate.mailbox.viewedAt
                          ? ` ${formatDateTime(candidate.mailbox.viewedAt)}`
                          : ""
                      }`
                    : "password not yet collected"}
                </p>
              </div>
            ) : (
              <ProvisionForm
                onSubmit={async (address, password) => {
                  const data = await act({ action: "provision", address, password });
                  if (data) setIssued({ address: data.address, password: data.password });
                }}
              />
            )}
          </Card>
        )}
      </div>
    </div>
  );
}

function VerifyActions({
  onVerify,
  onReject,
}: {
  onVerify: () => void;
  onReject: (note: string) => void;
}) {
  const [rejecting, setRejecting] = useState(false);
  const [note, setNote] = useState("");

  if (rejecting) {
    return (
      <div className="space-y-4">
        <Field label="What needs correcting?" hint="The candidate sees this, and signs again after fixing it.">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className={`${inputClass} resize-y`}
            style={inputStyle}
          />
        </Field>
        <div className="flex flex-wrap gap-3">
          <Button variant="danger" disabled={!note.trim()} onClick={() => onReject(note.trim())}>
            Send back
          </Button>
          <Button variant="ghost" onClick={() => setRejecting(false)}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Button onClick={onVerify}>
        <Check className="size-4" aria-hidden />
        Verify signature
      </Button>
      <Button variant="ghost" onClick={() => setRejecting(true)}>
        <X className="size-4" aria-hidden />
        Send back for correction
      </Button>
    </div>
  );
}

function ProvisionForm({
  onSubmit,
}: {
  onSubmit: (address: string, password: string) => void;
}) {
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="space-y-4">
      <Field label="Mailbox address" hint="The address you are creating on SpaceMail.">
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="firstname@focusrealm.org"
          className={inputClass}
          style={inputStyle}
        />
      </Field>
      <Field
        label="Temporary password"
        hint="Leave blank to have one generated. Whatever is here must match what you set in SpaceMail."
      >
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
          style={inputStyle}
          autoComplete="off"
        />
      </Field>
      <Button disabled={!address.trim()} onClick={() => onSubmit(address.trim(), password.trim())}>
        <Mail className="size-4" aria-hidden />
        Record mailbox and release to candidate
      </Button>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-bold tracking-wide uppercase" style={{ color: "var(--fr-muted)" }}>
        {label}
      </dt>
      <dd className="mt-1 text-sm leading-snug break-words">{value}</dd>
    </div>
  );
}
