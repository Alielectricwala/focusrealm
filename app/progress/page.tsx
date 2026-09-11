"use client";

import Link from "next/link";
import { Award, Check, ChevronRight, ThumbsUp, TrendingUp } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ProgressRing from "@/components/ProgressRing";
import { ACTIVE_TASK, SERVICE_RECORD, SUPERVISOR, getSop } from "@/lib/data";
import { PHASE_LABEL, PHASE_ORDER } from "@/lib/ui";
import { useStaffState } from "@/lib/store";

/** The staff member's personal performance record. */
export default function ProgressPage() {
  const { steps } = useStaffState();
  const sop = getSop(ACTIVE_TASK.sopId);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Performance"
        title="Service record"
        subtitle="What you have verified, what you are running, and what to sharpen."
      />

      {/* Headline */}
      <section className="flex flex-wrap items-center gap-5 rounded-xl border border-line bg-surface p-5">
        <ProgressRing
          percent={SERVICE_RECORD.fiveStarScore}
          size={112}
          stroke={10}
          sublabel="ready"
          className="text-gold-500"
        />
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-semibold text-ink-900">Five-star ready</h2>
          <p className="mt-1 text-sm leading-snug text-ink-500">
            Across verified standards, on-time releases and supervisor spot-checks
            this quarter.
          </p>
          <dl className="mt-4 flex flex-wrap gap-6">
            <div>
              <dt className="text-[11px] font-bold text-ink-400 uppercase">
                Verified
              </dt>
              <dd className="font-mono text-2xl font-semibold text-emerald-600">
                {SERVICE_RECORD.verifiedStandards}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold text-ink-400 uppercase">
                Active
              </dt>
              <dd className="font-mono text-2xl font-semibold text-amber-600">
                {SERVICE_RECORD.activeStandards}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Live task breakdown */}
      {sop && (
        <section
          aria-labelledby="breakdown"
          className="overflow-hidden rounded-xl border border-line bg-surface"
        >
          <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line p-4">
            <div>
              <h2 id="breakdown" className="text-lg font-semibold text-ink-900">
                Current task
              </h2>
              <p className="font-mono text-xs font-bold text-ink-400">
                Room {ACTIVE_TASK.room} · {sop.code}
              </p>
            </div>
            <Link
              href={`/sop/${sop.id}/practice`}
              className="flex min-h-11 items-center gap-2 rounded-xl bg-canvas px-4 text-sm font-bold text-ink-700 hover:bg-canvas"
            >
              Open runner
              <ChevronRight className="size-5" aria-hidden />
            </Link>
          </header>

          <div className="grid gap-px bg-canvas sm:grid-cols-2 lg:grid-cols-4">
            {PHASE_ORDER.map((phaseKey, index) => {
              const phase = sop.phases.find((p) => p.key === phaseKey);
              if (!phase) return null;

              const done = phase.steps.filter((s) => steps[s.id]).length;
              const complete = done === phase.steps.length;

              return (
                <div key={phaseKey} className="bg-surface p-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex size-7 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-semibold ${
                        complete
                          ? "bg-emerald-600 text-white"
                          : done > 0
                            ? "bg-gold-500 text-white"
                            : "bg-line text-ink-500"
                      }`}
                      aria-hidden
                    >
                      {complete ? <Check className="size-4" strokeWidth={3} /> : index + 1}
                    </span>
                    <h3 className="text-sm font-semibold text-ink-900">
                      {PHASE_LABEL[phaseKey]}
                    </h3>
                    <span className="ml-auto font-mono text-xs font-bold text-ink-400">
                      {done}/{phase.steps.length}
                    </span>
                  </div>

                  <ul className="mt-3 space-y-1.5">
                    {phase.steps.map((step) => {
                      const ticked = Boolean(steps[step.id]);
                      return (
                        <li key={step.id} className="flex items-start gap-2">
                          <span
                            className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded ${
                              ticked
                                ? "bg-emerald-600 text-white"
                                : "ring-1.5 ring-line-strong"
                            }`}
                            aria-hidden
                          >
                            {ticked && <Check className="size-3" strokeWidth={4} />}
                          </span>
                          <span
                            className={`text-xs leading-snug text-pretty ${
                              ticked ? "text-ink-400 line-through" : "text-ink-600"
                            }`}
                          >
                            {step.text}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Supervisor comments */}
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-line bg-surface p-4">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink-900">
            <ThumbsUp className="size-4 text-emerald-600" aria-hidden />
            Strengths
          </h2>
          <ul className="space-y-2.5">
            {SERVICE_RECORD.strengths.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span
                  className="mt-1 size-2 shrink-0 rounded-full bg-emerald-600"
                  aria-hidden
                />
                <span className="text-sm leading-snug text-pretty text-ink-600">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-line bg-surface p-4">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink-900">
            <TrendingUp className="size-4 text-amber-600" aria-hidden />
            Areas to improve
          </h2>
          <ul className="space-y-2.5">
            {SERVICE_RECORD.improvements.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span
                  className="mt-1 size-2 shrink-0 rounded-full bg-gold-500"
                  aria-hidden
                />
                <span className="text-sm leading-snug text-pretty text-ink-600">
                  {item}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-line pt-3 text-xs font-medium text-ink-400">
            From {SUPERVISOR.name}, {SUPERVISOR.title}
          </p>
        </section>
      </div>

      {/* Credentials */}
      <section aria-labelledby="credentials">
        <h2 id="credentials" className="mb-3 text-lg font-semibold text-ink-900">
          Verified credentials
        </h2>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_RECORD.credentials.map((credential) => (
            <li
              key={credential.id}
              className="flex items-start gap-3 rounded-xl border border-line bg-surface p-4"
            >
              <span
                className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"
                aria-hidden
              >
                <Award className="size-6" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-xs font-semibold text-ink-400">
                  {credential.code}
                </p>
                <p className="text-sm leading-snug font-bold text-balance text-ink-900">
                  {credential.title}
                </p>
                <p className="mt-1 text-xs font-medium text-ink-500">
                  Verified {credential.verifiedAt}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
