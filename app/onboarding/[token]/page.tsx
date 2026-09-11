"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PartyPopper } from "lucide-react";
import ContractStage from "@/components/onboarding/ContractStage";
import DetailsStage from "@/components/onboarding/DetailsStage";
import LearningStage from "@/components/onboarding/LearningStage";
import MailboxStage from "@/components/onboarding/MailboxStage";
import StageRail from "@/components/onboarding/StageRail";
import TestsStage from "@/components/onboarding/TestsStage";
import { Card, Notice, SectionTitle, Wordmark, formatDate } from "@/components/onboarding/ui";
import { stageIndex } from "@/lib/onboarding/stage";
import { type CandidateView } from "@/lib/onboarding/types";

/** The candidate's whole onboarding, behind the token in their invite link. */
export default function CandidatePortal() {
  const { token } = useParams<{ token: string }>();
  const [candidate, setCandidate] = useState<CandidateView | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "invalid">("loading");

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/onboarding/session/${token}`)
      .then(async (response) => {
        if (cancelled) return;
        if (!response.ok) {
          setState("invalid");
          return;
        }
        setCandidate((await response.json()) as CandidateView);
        setState("ready");
      })
      .catch(() => !cancelled && setState("invalid"));

    return () => {
      cancelled = true;
    };
  }, [token]);

  const onSaved = useCallback((next: CandidateView) => setCandidate(next), []);

  if (state === "loading") {
    return (
      <Shell>
        <p style={{ color: "var(--fr-muted)" }}>Loading your onboarding…</p>
      </Shell>
    );
  }

  if (state === "invalid" || !candidate) {
    return (
      <Shell>
        <Card>
          <SectionTitle
            title="This link is not valid"
            lead="It may have been mistyped, or withdrawn. Check the link in your invitation, or reply to the email it came from."
          />
        </Card>
      </Shell>
    );
  }

  const at = stageIndex(candidate.stage);

  return (
    <Shell subtitle={`${candidate.role.label} internship`}>
      <header className="mb-6">
        <h1 className="text-2xl leading-tight font-bold text-balance sm:text-3xl">
          Welcome, {candidate.details?.fullName ?? candidate.invitedName}.
        </h1>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--fr-muted)" }}>
          Six steps between here and your first day, starting {formatDate(candidate.startDate)}.
          Your progress is saved as you go — you can close this and come back to the same link.
        </p>
      </header>

      <div className="mb-8">
        <StageRail stage={candidate.stage} />
      </div>

      {candidate.stage === "complete" && (
        <div className="mb-5">
          <Card>
            <div className="flex items-start gap-4">
              <PartyPopper className="size-7 shrink-0" style={{ color: "var(--fr-gold)" }} aria-hidden />
              <div>
                <h2 className="text-lg font-bold">You are fully onboarded.</h2>
                <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "var(--fr-muted)" }}>
                  Agreement signed and verified, both assessments passed, mailbox live. Everything
                  below stays here for your reference.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      <div className="space-y-5">
        <DetailsStage token={token} candidate={candidate} onSaved={onSaved} />
        <LearningStage token={token} candidate={candidate} onSaved={onSaved} locked={at < 1} />
        <TestsStage token={token} candidate={candidate} onSaved={onSaved} locked={at < 2} />
        <ContractStage token={token} candidate={candidate} onSaved={onSaved} locked={at < 3} />
        <MailboxStage token={token} candidate={candidate} onSaved={onSaved} locked={at < 5} />
      </div>

      <footer className="mt-10 space-y-4 border-t pt-6 fr-rule">
        <Notice>
          Something not right, or stuck on a step? Reply to the email your invitation came from —
          Ali or Sehej will sort it out.
        </Notice>
        <p className="text-xs leading-relaxed" style={{ color: "var(--fr-muted)" }}>
          Your personal data is handled under the{" "}
          <Link href="/onboarding/privacy" className="underline" style={{ color: "var(--fr-gold-soft)" }}>
            onboarding privacy notice
          </Link>
          . You can ask to see, correct or erase your data, or withdraw your consent, at any
          time — including after your internship starts.
        </p>
      </footer>
    </Shell>
  );
}

function Shell({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="mb-8">
        <Wordmark subtitle={subtitle ?? "Intern onboarding"} />
      </div>
      {children}
    </div>
  );
}
