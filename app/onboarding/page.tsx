"use client";

import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ProgressRing from "@/components/ProgressRing";
import { ONBOARDING_PROFILE, ONBOARDING_SECTIONS, onboardingTaskCount } from "@/lib/data";
import { useStaffState } from "@/lib/store";

/** New-hire onboarding: what to complete, by when, and who is guiding it. */
export default function OnboardingPage() {
  const { onboardingChecks, toggleOnboardingTask } = useStaffState();

  const total = onboardingTaskCount();
  const done = ONBOARDING_SECTIONS.reduce(
    (count, section) =>
      count + section.tasks.filter((task) => onboardingChecks[task.id]).length,
    0,
  );
  const percent = total > 0 ? (done / total) * 100 : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Onboarding"
        subtitle={`Getting set up on the floor · target complete by ${ONBOARDING_PROFILE.targetCompleteBy}.`}
      />

      {/* Headline */}
      <section className="flex flex-wrap items-center gap-5 rounded-2xl border border-stone-200 bg-white p-5">
        <ProgressRing
          percent={percent}
          size={112}
          stroke={10}
          sublabel="complete"
          className="text-emerald-500"
        />
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-black text-stone-900">
            {done} of {total} steps done
          </h2>
          <p className="mt-1 text-sm leading-snug text-stone-500">
            Started {ONBOARDING_PROFILE.startDate}. Tick off each step as you complete
            it — your buddy can see your progress.
          </p>
          <div className="mt-4 flex items-center gap-3 rounded-xl bg-stone-50 p-3">
            <span
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-stone-700 text-xs font-black text-white"
              aria-hidden
            >
              {ONBOARDING_PROFILE.buddyInitials}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm leading-tight font-bold text-stone-900">
                {ONBOARDING_PROFILE.buddyName}
              </span>
              <span className="block truncate text-xs leading-tight text-stone-500">
                Your onboarding buddy · {ONBOARDING_PROFILE.buddyTitle}
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* Checklist, by window */}
      {ONBOARDING_SECTIONS.map((section) => {
        const sectionDone = section.tasks.filter((task) => onboardingChecks[task.id]).length;
        const sectionComplete = sectionDone === section.tasks.length;

        return (
          <section
            key={section.id}
            aria-labelledby={section.id}
            className="overflow-hidden rounded-2xl border border-stone-200 bg-white"
          >
            <header className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 p-4">
              <div>
                <h2 id={section.id} className="text-lg font-black text-stone-900">
                  {section.title}
                </h2>
                <p className="text-xs font-bold text-stone-400">{section.window}</p>
              </div>
              <p
                className={`font-mono text-sm font-black ${
                  sectionComplete ? "text-emerald-600" : "text-stone-900"
                }`}
              >
                {sectionDone}
                <span className="text-stone-400">/{section.tasks.length}</span>
              </p>
            </header>

            <ul className="divide-y divide-stone-100">
              {section.tasks.map((task) => {
                const ticked = Boolean(onboardingChecks[task.id]);
                return (
                  <li key={task.id} className="flex items-start gap-3 p-4">
                    <button
                      type="button"
                      onClick={() => toggleOnboardingTask(task.id)}
                      aria-pressed={ticked}
                      aria-label={`Mark "${task.title}" ${ticked ? "not done" : "done"}`}
                      className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full ${
                        ticked
                          ? "bg-emerald-500 text-white"
                          : "ring-1.5 ring-stone-300 hover:ring-stone-400"
                      }`}
                    >
                      {ticked && <Check className="size-4" strokeWidth={3} />}
                    </button>

                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm leading-snug font-bold text-balance ${
                          ticked ? "text-stone-400 line-through" : "text-stone-900"
                        }`}
                      >
                        {task.title}
                      </p>
                      <p
                        className={`mt-1 text-sm leading-snug text-pretty ${
                          ticked ? "text-stone-400" : "text-stone-500"
                        }`}
                      >
                        {task.detail}
                      </p>
                      {task.href && (
                        <Link
                          href={task.href}
                          className="mt-2 inline-flex min-h-8 items-center gap-1 text-sm font-bold text-emerald-700 hover:text-emerald-800"
                        >
                          {task.linkLabel ?? "Open"}
                          <ChevronRight className="size-4" aria-hidden />
                        </Link>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
