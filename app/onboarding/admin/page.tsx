"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Copy, FileWarning, Plus, RefreshCw } from "lucide-react";
import {
  Button,
  Card,
  Field,
  Notice,
  SectionTitle,
  Wordmark,
  formatDate,
  inputClass,
  inputStyle,
} from "@/components/onboarding/ui";
import {
  BUILT_IN_TRACKS,
  DEFAULT_TERM_MONTHS,
  MAX_TERM_MONTHS,
  MIN_TERM_MONTHS,
  STAGE_LABEL,
  type AgreementPlan,
  type InternTrack,
  type Stage,
  type TrackDefinition,
} from "@/lib/onboarding/types";

interface Row {
  id: string;
  token: string;
  invitedName: string;
  invitedEmail: string;
  track: InternTrack;
  role: TrackDefinition;
  startDate: string;
  endDate: string;
  termMonths: number;
  agreementKind: AgreementPlan["kind"];
  agreementReady: boolean;
  stage: Stage;
  fullName: string | null;
  signedAt: string | null;
  contractVerifiedAt: string | null;
  emailRequestedAt: string | null;
  mailbox: string | null;
}

const DAY = 86_400_000;

function daysUntil(iso: string): number {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / DAY);
}

function needsFounder(row: Row): boolean {
  return Boolean(
    (row.signedAt && !row.contractVerifiedAt) ||
      (row.emailRequestedAt && !row.mailbox) ||
      !row.agreementReady,
  );
}

/* -------------------------------------------------------------------------- */
/* Dashboard                                                                  */
/* -------------------------------------------------------------------------- */

export default function AdminConsole() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [creating, setCreating] = useState(false);

  const load = useCallback(
    () =>
      fetch("/api/onboarding/admin/candidates")
        .then(async (response) => {
          if (response.status === 401) {
            setNeedsAuth(true);
            return;
          }
          setNeedsAuth(false);
          setRows((await response.json()) as Row[]);
        })
        .catch(() => {}),
    [],
  );

  useEffect(() => {
    load();
  }, [load]);

  const stats = useMemo(() => {
    if (!rows) return null;
    return {
      total: rows.length,
      onboarding: rows.filter((r) => r.stage !== "complete").length,
      needsYou: rows.filter(needsFounder).length,
      agreementsToPrepare: rows.filter((r) => !r.agreementReady).length,
      endingSoon: rows.filter((r) => {
        const days = daysUntil(r.endDate);
        return days >= 0 && days <= 30;
      }).length,
    };
  }, [rows]);

  if (needsAuth) return <PasscodeGate onDone={load} />;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <Wordmark subtitle="Onboarding console" />
        <div className="flex gap-2">
          <Button variant="ghost" onClick={load}>
            <RefreshCw className="size-4" aria-hidden />
            Refresh
          </Button>
          <Button onClick={() => setCreating((v) => !v)}>
            <Plus className="size-4" aria-hidden />
            New candidate
          </Button>
        </div>
      </div>

      {stats && (
        <dl className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-5">
          <Stat label="Candidates" value={stats.total} />
          <Stat label="Onboarding" value={stats.onboarding} />
          <Stat label="Needs you" value={stats.needsYou} tone={stats.needsYou > 0 ? "gold" : undefined} />
          <Stat
            label="Agreements to prepare"
            value={stats.agreementsToPrepare}
            tone={stats.agreementsToPrepare > 0 ? "gold" : undefined}
          />
          <Stat label="Ending ≤ 30 days" value={stats.endingSoon} />
        </dl>
      )}

      {creating && (
        <div className="mb-5">
          <NewCandidate
            onCreated={() => {
              setCreating(false);
              load();
            }}
          />
        </div>
      )}

      <Card className="!p-0">
        <div className="border-b p-5 fr-rule sm:p-6">
          <SectionTitle
            title="Candidates"
            lead="Newest first. Open one to review documents, prepare an agreement, and act."
          />
        </div>

        {!rows ? (
          <p className="p-6 text-sm" style={{ color: "var(--fr-muted)" }}>
            Loading…
          </p>
        ) : rows.length === 0 ? (
          <p className="p-6 text-sm" style={{ color: "var(--fr-muted)" }}>
            No candidates yet. Create one to generate an onboarding link.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[54rem] text-left text-sm">
              <thead>
                <tr
                  className="text-[11px] tracking-[0.14em] uppercase"
                  style={{ color: "var(--fr-muted)" }}
                >
                  <Th>Candidate</Th>
                  <Th>Role</Th>
                  <Th>Term</Th>
                  <Th>Starts</Th>
                  <Th>Ends</Th>
                  <Th>Stage</Th>
                  <Th>Flags</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const remaining = daysUntil(row.endDate);
                  const ended = remaining < 0;

                  return (
                    <tr key={row.id} className="border-t align-top fr-rule">
                      <Td>
                        <Link
                          href={`/onboarding/admin/${row.id}`}
                          className="font-bold hover:underline"
                        >
                          {row.fullName ?? row.invitedName}
                        </Link>
                        <span className="mt-0.5 block text-xs" style={{ color: "var(--fr-muted)" }}>
                          {row.invitedEmail}
                        </span>
                      </Td>
                      <Td>{row.role.label}</Td>
                      <Td>
                        <span className="tabular-nums">{row.termMonths} mo</span>
                      </Td>
                      <Td>
                        <span className="tabular-nums">{formatDate(row.startDate)}</span>
                      </Td>
                      <Td>
                        <span className="tabular-nums">{formatDate(row.endDate)}</span>
                        <span
                          className="mt-0.5 block text-xs"
                          style={{ color: ended ? "var(--fr-muted)" : "var(--fr-gold-soft)" }}
                        >
                          {ended
                            ? `ended ${Math.abs(remaining)}d ago`
                            : `${remaining}d remaining`}
                        </span>
                      </Td>
                      <Td>
                        <span
                          className="inline-block rounded-md px-2 py-1 text-xs"
                          style={{
                            backgroundColor: "var(--fr-navy-soft)",
                            color: "var(--fr-muted)",
                          }}
                        >
                          {STAGE_LABEL[row.stage]}
                        </span>
                      </Td>
                      <Td>
                        <div className="flex flex-wrap gap-1.5">
                          {!row.agreementReady && (
                            <Flag tone="gold" Icon={FileWarning}>
                              Agreement needed
                            </Flag>
                          )}
                          {row.signedAt && !row.contractVerifiedAt && (
                            <Flag tone="gold" Icon={AlertTriangle}>
                              Verify signature
                            </Flag>
                          )}
                          {row.emailRequestedAt && !row.mailbox && (
                            <Flag tone="gold" Icon={AlertTriangle}>
                              Create mailbox
                            </Flag>
                          )}
                        </div>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "gold";
}) {
  return (
    <div
      className="rounded-xl border p-4"
      style={{ borderColor: "var(--fr-line)", backgroundColor: "var(--fr-navy)" }}
    >
      <dt
        className="text-[10px] font-bold tracking-[0.14em] uppercase"
        style={{ color: "var(--fr-muted)" }}
      >
        {label}
      </dt>
      <dd
        className="mt-2 text-2xl leading-none font-bold tabular-nums"
        style={{ color: tone === "gold" && value > 0 ? "var(--fr-gold-soft)" : "var(--fr-paper)" }}
      >
        {value}
      </dd>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 font-semibold first:pl-5 last:pr-5">{children}</th>;
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3.5 first:pl-5 last:pr-5">{children}</td>;
}

function Flag({
  children,
  Icon,
}: {
  children: React.ReactNode;
  tone: "gold";
  Icon: typeof AlertTriangle;
}) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold whitespace-nowrap"
      style={{ backgroundColor: "var(--fr-gold)", color: "var(--fr-navy-deep)" }}
    >
      <Icon className="size-3" aria-hidden />
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Gate                                                                       */
/* -------------------------------------------------------------------------- */

function PasscodeGate({ onDone }: { onDone: () => void }) {
  const [passcode, setPasscode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    setMessage(null);

    const response = await fetch("/api/onboarding/admin/session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ passcode }),
    });
    setBusy(false);

    if (!response.ok) {
      setMessage("Incorrect passcode.");
      return;
    }
    onDone();
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-16 sm:px-6">
      <div className="mb-8">
        <Wordmark subtitle="Onboarding console" />
      </div>
      <Card>
        <SectionTitle
          title="Founders only"
          lead="This console shows candidates' identity documents. Enter the shared passcode to continue."
        />
        <div className="space-y-4">
          <Field label="Passcode">
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              className={inputClass}
              style={inputStyle}
              autoFocus
            />
          </Field>
          {message && <Notice tone="bad">{message}</Notice>}
          <Button disabled={busy || !passcode} onClick={submit}>
            {busy ? "Checking…" : "Enter"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Invite                                                                     */
/* -------------------------------------------------------------------------- */

function NewCandidate({ onCreated }: { onCreated: () => void }) {
  const [track, setTrack] = useState("founders-office");
  const [agreementKind, setAgreementKind] =
    useState<AgreementPlan["kind"]>("standard");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [created, setCreated] = useState<{ id: string; link: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const known = BUILT_IN_TRACKS[track];
  // Only the Founder's Office agreement exists as a reviewed document.
  const hasAgreementOnFile = Boolean(known?.agreementOnFile);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);

    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/onboarding/admin/candidates", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        invitedName: form.get("invitedName"),
        invitedEmail: form.get("invitedEmail"),
        track,
        startDate: form.get("startDate"),
        termMonths: Number(form.get("termMonths")),
        agreementKind: hasAgreementOnFile ? "standard" : agreementKind,
        customRole:
          track === "custom"
            ? {
                label: form.get("customLabel"),
                roleTitle: form.get("customRoleTitle"),
                duties: form.get("customDuties"),
              }
            : undefined,
      }),
    });
    const data = await response.json();
    setBusy(false);

    if (!response.ok) {
      setMessage(data.error ?? "Could not create.");
      return;
    }
    setCreated({
      id: data.id as string,
      link: `${window.location.origin}/onboarding/${data.token}`,
    });
  }

  if (created) {
    return (
      <Card>
        <SectionTitle
          title="Onboarding link ready"
          lead="Send this to the candidate. It is the only way into their onboarding, so treat it like a password — anyone holding it can submit details as them."
        />
        <p
          className="mb-4 rounded-xl border p-4 font-mono text-sm break-all"
          style={{ borderColor: "var(--fr-line)", backgroundColor: "var(--fr-navy-deep)" }}
        >
          {created.link}
        </p>

        {agreementKind === "bespoke" && !hasAgreementOnFile && (
          <div className="mb-4">
            <Notice tone="warn">
              This candidate cannot reach a signature until you upload their agreement.
              Open their record and add the document.
            </Notice>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => {
              navigator.clipboard?.writeText(created.link);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
          >
            <Copy className="size-4" aria-hidden />
            {copied ? "Copied" : "Copy link"}
          </Button>
          <Button variant="ghost" onClick={onCreated}>
            Done
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <SectionTitle title="New candidate" lead="Creates their onboarding link." />
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name">
            <input name="invitedName" required className={inputClass} style={inputStyle} />
          </Field>
          <Field label="Email">
            <input name="invitedEmail" required type="email" className={inputClass} style={inputStyle} />
          </Field>
          <Field label="Role">
            <select
              name="track"
              required
              className={inputClass}
              style={inputStyle}
              value={track}
              onChange={(event) => setTrack(event.target.value)}
            >
              {Object.values(BUILT_IN_TRACKS).map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
              <option value="custom">Custom role…</option>
            </select>
          </Field>
          <Field label="Start date">
            <input name="startDate" required type="date" className={inputClass} style={inputStyle} />
          </Field>
          <Field
            label="Length of the internship"
            hint="In months. Written into the agreement, and used for the end date."
          >
            <input
              name="termMonths"
              required
              type="number"
              min={MIN_TERM_MONTHS}
              max={MAX_TERM_MONTHS}
              step={1}
              defaultValue={DEFAULT_TERM_MONTHS}
              className={inputClass}
              style={inputStyle}
            />
          </Field>
        </div>

        {track === "custom" && (
          <div
            className="space-y-4 rounded-xl border p-4"
            style={{ borderColor: "var(--fr-line)", backgroundColor: "var(--fr-navy-deep)" }}
          >
            <p className="text-xs leading-relaxed" style={{ color: "var(--fr-muted)" }}>
              A custom role is written into this candidate&apos;s agreement exactly as you
              enter it here, and is frozen on their record — editing it later cannot change
              an agreement they have already signed.
            </p>

            <Field label="Role name" hint='Shown in the portal and the console, e.g. "Design".'>
              <input
                name="customLabel"
                required
                maxLength={60}
                placeholder="Design"
                className={inputClass}
                style={inputStyle}
              />
            </Field>

            <Field
              label="Role title for the agreement"
              hint='The title in Clause 1, e.g. "Design Intern".'
            >
              <input
                name="customRoleTitle"
                required
                maxLength={80}
                placeholder="Design Intern"
                className={inputClass}
                style={inputStyle}
              />
            </Field>

            <Field
              label="Duties and responsibilities"
              hint="Completes the sentence “assisting with …” in the duties clause."
            >
              <textarea
                name="customDuties"
                required
                rows={3}
                maxLength={600}
                placeholder="product and brand design support, design-system upkeep, and asset production for the founding team"
                className={`${inputClass} resize-y`}
                style={inputStyle}
              />
            </Field>
          </div>
        )}

        {/*
          Only the Founder's Office agreement exists as a reviewed document. For
          every other role the founders have to decide, here, which agreement
          this candidate signs.
        */}
        {!hasAgreementOnFile && (
          <fieldset
            className="rounded-xl border p-4"
            style={{ borderColor: "var(--fr-gold)", backgroundColor: "var(--fr-navy-deep)" }}
          >
            <legend
              className="px-1 text-xs font-bold tracking-[0.16em] uppercase"
              style={{ color: "var(--fr-gold)" }}
            >
              Agreement for this role
            </legend>
            <p className="mb-3 text-xs leading-relaxed" style={{ color: "var(--fr-muted)" }}>
              The only agreement on file is the Founder&apos;s Office one. Choose what this
              candidate signs.
            </p>

            <div className="space-y-3">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="radio"
                  name="agreementKind"
                  checked={agreementKind === "standard"}
                  onChange={() => setAgreementKind("standard")}
                  className="mt-0.5 size-4 shrink-0 accent-[var(--fr-gold)]"
                />
                <span className="min-w-0">
                  <span className="block text-sm font-bold">
                    Issue the standard agreement for this role
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed" style={{ color: "var(--fr-muted)" }}>
                    Identical to the Founder&apos;s Office agreement clause for clause. Only
                    the role title, the duties above and the term change. Ready to sign
                    immediately.
                  </span>
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="radio"
                  name="agreementKind"
                  checked={agreementKind === "bespoke"}
                  onChange={() => setAgreementKind("bespoke")}
                  className="mt-0.5 size-4 shrink-0 accent-[var(--fr-gold)]"
                />
                <span className="min-w-0">
                  <span className="block text-sm font-bold">
                    Upload an agreement or job description for this role
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed" style={{ color: "var(--fr-muted)" }}>
                    Use this where the terms differ beyond duties and title. You upload the
                    document from the candidate&apos;s record, and they cannot reach a
                    signature until you have.
                  </span>
                </span>
              </label>
            </div>
          </fieldset>
        )}

        {message && <Notice tone="bad">{message}</Notice>}

        <Button type="submit" disabled={busy}>
          {busy ? "Creating…" : "Create and generate link"}
        </Button>
      </form>
    </Card>
  );
}
