"use client";

import Link from "next/link";
import { ArrowLeft, Check, LifeBuoy, Wallet } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { SERVICE_RECOVERY } from "@/lib/data";
import { useStaffState } from "@/lib/store";

/** The guided guest-recovery flow: Listen, Acknowledge, Resolve, Follow up. */
export default function ServiceRecoveryPage() {
  const { recoverySteps, toggleRecoveryStep } = useStaffState();
  const doneCount = SERVICE_RECOVERY.steps.filter(
    (step) => recoverySteps[step.key],
  ).length;

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/"
        className="mb-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-surface px-4 text-sm font-bold text-ink-700 ring-1 ring-line hover:bg-canvas"
      >
        <ArrowLeft className="size-5" aria-hidden />
        Today
      </Link>

      <PageHeader
        eyebrow="Operations"
        title="Service recovery"
        subtitle="A guest issue in front of you right now — work it in this order."
      />

      {/* Spend authorisation */}
      <section className="mb-5 flex items-center gap-4 rounded-xl border border-line bg-navy-800 p-4 text-white">
        <span
          className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-surface/10"
          aria-hidden
        >
          <Wallet className="size-6" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold tracking-wide text-white/50 uppercase">
            Your spend authorisation
          </p>
          <p className="font-mono text-2xl leading-tight font-semibold">
            {SERVICE_RECOVERY.currency} {SERVICE_RECOVERY.spendLimit}
          </p>
          <p className="mt-0.5 text-xs text-white/60">
            Act inside this without asking. Above it, call the duty manager.
          </p>
        </div>
      </section>

      {/* Steps */}
      <ol className="space-y-3">
        {SERVICE_RECOVERY.steps.map((step, index) => {
          const done = Boolean(recoverySteps[step.key]);

          return (
            <li key={step.key}>
              <article
                className={`overflow-hidden rounded-xl border bg-surface ${
                  done ? "border-emerald-200" : "border-line"
                }`}
              >
                <header className="flex items-start gap-3 p-4">
                  <span
                    className={`flex size-11 shrink-0 items-center justify-center rounded-xl font-mono text-base font-semibold ${
                      done ? "bg-emerald-600 text-white" : "bg-navy-800 text-white"
                    }`}
                    aria-hidden
                  >
                    {done ? <Check className="size-5" strokeWidth={3} /> : index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg leading-tight font-semibold text-ink-900">
                      {step.title}
                    </h2>
                    <p className="mt-1 text-sm leading-snug text-pretty text-ink-500">
                      {step.prompt}
                    </p>
                  </div>
                </header>

                <ul className="space-y-2 px-4 pb-4">
                  {step.actions.map((action) => (
                    <li
                      key={action}
                      className="flex items-start gap-2.5 rounded-xl bg-canvas p-3"
                    >
                      <span
                        className="mt-1.5 size-1.5 shrink-0 rounded-full bg-ink-400"
                        aria-hidden
                      />
                      <span className="text-sm leading-snug text-pretty text-ink-700">
                        {action}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-line p-3">
                  <button
                    type="button"
                    aria-pressed={done}
                    onClick={() => toggleRecoveryStep(step.key)}
                    className={`flex min-h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold ${
                      done
                        ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200"
                        : "bg-navy-800 text-white hover:bg-navy-700"
                    }`}
                  >
                    {done ? (
                      <>
                        <Check className="size-5" strokeWidth={3} aria-hidden />
                        {step.title} done
                      </>
                    ) : (
                      `Mark ${step.title.toLowerCase()} done`
                    )}
                  </button>
                </div>
              </article>
            </li>
          );
        })}
      </ol>

      {doneCount === SERVICE_RECOVERY.steps.length && (
        <p className="mise-pop mt-4 flex min-h-11 items-center justify-center gap-2.5 rounded-xl bg-emerald-600 px-4 text-base font-semibold text-white">
          <LifeBuoy className="size-6" aria-hidden />
          Recovery closed — hand any open promise to the next shift
        </p>
      )}

      {/* Shared incident timeline */}
      <section aria-labelledby="timeline" className="mt-6">
        <h2 id="timeline" className="mb-3 text-lg font-semibold text-ink-900">
          Incident timeline
        </h2>
        <ol className="overflow-hidden rounded-xl border border-line bg-surface">
          {SERVICE_RECOVERY.timeline.map((entry, index) => {
            const last = index === SERVICE_RECOVERY.timeline.length - 1;
            return (
              <li
                key={entry.id}
                className={`flex gap-3 p-4 ${last ? "" : "border-b border-line"}`}
              >
                <div className="flex flex-col items-center">
                  <span
                    className="size-3 shrink-0 rounded-full bg-line-strong ring-4 ring-line"
                    aria-hidden
                  />
                  {!last && <span className="mt-1 w-0.5 flex-1 bg-line" aria-hidden />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-baseline gap-x-2">
                    <span className="font-mono text-sm font-semibold text-ink-900">
                      {entry.at}
                    </span>
                    <span className="text-xs font-bold text-ink-500">
                      {entry.actor}
                    </span>
                  </p>
                  <p className="mt-0.5 text-sm leading-snug text-pretty text-ink-600">
                    {entry.detail}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
