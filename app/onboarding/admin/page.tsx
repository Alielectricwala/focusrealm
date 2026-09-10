"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Copy, Plus, RefreshCw } from "lucide-react";
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
import { STAGE_LABEL, TRACK_LABEL, type InternTrack, type Stage } from "@/lib/onboarding/types";

interface Row {
  id: string;
  token: string;
  invitedName: string;
  invitedEmail: string;
  track: InternTrack;
  startDate: string;
  stage: Stage;
  fullName: string | null;
  signedAt: string | null;
  contractVerifiedAt: string | null;
  emailRequestedAt: string | null;
  mailbox: string | null;
}

/** Founders' console: who is onboarding, and what needs a decision. */
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

  if (needsAuth) return <PasscodeGate onDone={load} />;

  const waiting = rows?.filter(
    (r) => (r.signedAt && !r.contractVerifiedAt) || (r.emailRequestedAt && !r.mailbox),
  );

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
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

      {waiting && waiting.length > 0 && (
        <div className="mb-5">
          <Notice tone="warn">
            {waiting.length} candidate{waiting.length === 1 ? "" : "s"} waiting on you — a signed
            agreement to verify, or a mailbox to create.
          </Notice>
        </div>
      )}

      <Card>
        <SectionTitle title="Candidates" lead="Newest first. Open one to review documents and act." />

        {!rows ? (
          <p style={{ color: "var(--fr-muted)" }}>Loading…</p>
        ) : rows.length === 0 ? (
          <p style={{ color: "var(--fr-muted)" }}>
            No candidates yet. Create one to generate an onboarding link.
          </p>
        ) : (
          <ul className="space-y-3">
            {rows.map((row) => {
              const needsYou =
                (row.signedAt && !row.contractVerifiedAt) || (row.emailRequestedAt && !row.mailbox);

              return (
                <li key={row.id}>
                  <Link
                    href={`/onboarding/admin/${row.id}`}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4 transition-colors"
                    style={{
                      borderColor: needsYou ? "var(--fr-gold)" : "var(--fr-line)",
                      backgroundColor: "var(--fr-navy-deep)",
                    }}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-base leading-snug font-bold">
                        {row.fullName ?? row.invitedName}
                      </p>
                      <p className="mt-0.5 text-xs" style={{ color: "var(--fr-muted)" }}>
                        {TRACK_LABEL[row.track]} · starts {formatDate(row.startDate)} ·{" "}
                        {row.invitedEmail}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      {needsYou && (
                        <span
                          className="rounded-lg px-2.5 py-1 text-[11px] font-black"
                          style={{ backgroundColor: "var(--fr-gold)", color: "var(--fr-navy-deep)" }}
                        >
                          Needs you
                        </span>
                      )}
                      <span
                        className="rounded-lg px-2.5 py-1 text-xs font-bold"
                        style={{ backgroundColor: "var(--fr-navy-soft)", color: "var(--fr-muted)" }}
                      >
                        {STAGE_LABEL[row.stage]}
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}

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

function NewCandidate({ onCreated }: { onCreated: () => void }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [link, setLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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
        track: form.get("track"),
        startDate: form.get("startDate"),
      }),
    });
    const data = await response.json();
    setBusy(false);

    if (!response.ok) {
      setMessage(data.error ?? "Could not create.");
      return;
    }
    setLink(`${window.location.origin}/onboarding/${data.token}`);
  }

  if (link) {
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
          {link}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => {
              navigator.clipboard?.writeText(link);
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
          <Field label="Track">
            <select name="track" required className={inputClass} style={inputStyle} defaultValue="founders-office">
              <option value="founders-office">Founder&apos;s Office</option>
              <option value="marketing">Marketing</option>
              <option value="business-development">Business Development</option>
            </select>
          </Field>
          <Field label="Start date">
            <input name="startDate" required type="date" className={inputClass} style={inputStyle} />
          </Field>
        </div>

        {message && <Notice tone="bad">{message}</Notice>}

        <Button type="submit" disabled={busy}>
          {busy ? "Creating…" : "Create and generate link"}
        </Button>
      </form>
    </Card>
  );
}
