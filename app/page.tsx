"use client";

import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  Clock,
  LifeBuoy,
  MessageCircle,
  Play,
  Sparkles,
} from "lucide-react";
import Countdown from "@/components/Countdown";
import FlagChips from "@/components/FlagChips";
import PageHeader from "@/components/PageHeader";
import ProgressRing from "@/components/ProgressRing";
import {
  Badge,
  ButtonLink,
  Eyebrow,
  Metric,
  MetricRow,
  Panel,
  PanelBody,
  PanelHeader,
} from "@/components/ui/kit";
import {
  ACTIVE_TASK,
  SHIFT_GLANCE,
  SHIFT_RHYTHM,
  STAFF,
  SUPERVISOR,
  getSop,
} from "@/lib/data";
import { STATUS } from "@/lib/ui";
import type { Status } from "@/lib/types";

/** Checkpoints are moments in the day, so they read differently to rooms. */
const CHECKPOINT_LABEL: Record<Status, string> = {
  complete: "Done",
  active: "In progress",
  urgent: "Due now",
  scheduled: "Upcoming",
};

/** Today: what is happening right now, and what the day looks like around it. */
export default function TodayPage() {
  const sop = getSop(ACTIVE_TASK.sopId);

  return (
    <div>
      <PageHeader
        eyebrow={`${STAFF.shiftDay} · ${STAFF.shiftLabel}`}
        title={`Good morning, ${STAFF.name.split(" ")[0]}`}
        subtitle={`${STAFF.department} · ${STAFF.property}`}
        action={
          <ButtonLink href="/shift" variant="secondary">
            Full shift
            <ArrowRight className="size-4" aria-hidden />
          </ButtonLink>
        }
      />

      <div className="grid gap-5 lg:grid-cols-3 lg:items-start">
        <div className="space-y-5 lg:col-span-2">
          {/* Live task */}
          <Panel accent={STATUS.active.solid} aria-labelledby="next-task">
            <PanelHeader
              id="next-task"
              eyebrow="Happening now"
              title="Live room assignment"
              action={
                <Badge tone="gold" dot="bg-gold-500">
                  Due {ACTIVE_TASK.dueAt}
                </Badge>
              }
            />
            <PanelBody>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <ProgressRing
                  percent={ACTIVE_TASK.percent ?? 0}
                  sublabel="complete"
                />

                <div className="min-w-0 flex-1">
                  <Eyebrow className="mb-1.5">Room</Eyebrow>
                  <p className="text-3xl leading-none font-semibold tracking-tight text-ink-900 tnum">
                    {ACTIVE_TASK.room}
                  </p>
                  {sop && (
                    <p className="mt-2 text-sm leading-snug font-medium text-ink-700">
                      <span className="font-mono text-xs text-ink-400">
                        {sop.code}
                      </span>{" "}
                      {sop.title}
                    </p>
                  )}
                  <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-ink-900">
                    <Clock className="size-4 text-ink-400" aria-hidden />
                    <Countdown seconds={ACTIVE_TASK.remainingSeconds ?? 0} />
                    <span className="font-normal text-ink-500">
                      left on target
                    </span>
                  </p>
                  <div className="mt-3">
                    <FlagChips flags={ACTIVE_TASK.flags} size="md" />
                  </div>
                </div>
              </div>

              <p className="mt-4 flex items-start gap-2 rounded-lg border border-gold-100 bg-gold-50 p-3 text-xs leading-snug text-ink-700">
                <Sparkles className="mt-0.5 size-4 shrink-0 text-gold-600" aria-hidden />
                <span>
                  <span className="font-semibold text-gold-600">
                    Five-star cue ·{" "}
                  </span>
                  {ACTIVE_TASK.fiveStarCue}
                </span>
              </p>

              {sop && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <ButtonLink href={`/sop/${sop.id}/practice`} variant="gold">
                    <Play className="size-4" aria-hidden />
                    Continue task
                  </ButtonLink>
                  <ButtonLink href={`/sop/${sop.id}`} variant="secondary">
                    Open standard
                  </ButtonLink>
                </div>
              )}
            </PanelBody>
          </Panel>

          {/* Shift rhythm */}
          <Panel aria-labelledby="rhythm">
            <PanelHeader
              id="rhythm"
              eyebrow="Timeline"
              title="Shift rhythm"
              description="Every checkpoint in today's duty plan."
            />
            <ol>
              {SHIFT_RHYTHM.map((checkpoint, index) => {
                const tone = STATUS[checkpoint.status];
                const last = index === SHIFT_RHYTHM.length - 1;

                return (
                  <li
                    key={checkpoint.id}
                    className={`flex gap-3 px-4 py-3.5 lg:px-5 ${
                      last ? "" : "border-b border-line"
                    }`}
                  >
                    <p className="w-12 shrink-0 pt-0.5 font-mono text-xs font-medium text-ink-500 tnum">
                      {checkpoint.at}
                    </p>
                    <div className="flex flex-col items-center pt-1">
                      <span
                        className={`size-2 shrink-0 rounded-full ring-4 ${tone.solid} ${tone.ring}`}
                        aria-hidden
                      />
                      {!last && (
                        <span className="mt-1 w-px flex-1 bg-line" aria-hidden />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <p className="text-sm font-semibold text-ink-900">
                          {checkpoint.label}
                        </p>
                        <Badge tone={tone.badge}>
                          {CHECKPOINT_LABEL[checkpoint.status]}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm leading-snug text-ink-500">
                        {checkpoint.detail}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </Panel>
        </div>

        {/* Right rail */}
        <div className="space-y-5">
          <Panel aria-labelledby="glance">
            <PanelHeader id="glance" eyebrow="Live" title="Shift at a glance" />
            <MetricRow className="grid-cols-2 divide-y divide-line sm:divide-y-0">
              <Metric
                label="Released"
                value={SHIFT_GLANCE.roomsReleased}
                suffix={`/ ${SHIFT_GLANCE.roomsTotal}`}
              />
              <Metric
                label="On-time"
                value={`${SHIFT_GLANCE.onTimePace}%`}
                tone="positive"
              />
            </MetricRow>
            <div className="border-t border-line px-4 py-3">
              <Eyebrow className="mb-1.5">Arrival pressure</Eyebrow>
              <p className="text-sm font-medium text-ink-700">
                {SHIFT_GLANCE.arrivalPressure}
              </p>
            </div>
          </Panel>

          <Panel aria-labelledby="supervisor">
            <PanelHeader id="supervisor" eyebrow="Escalation" title="Your supervisor" />
            <PanelBody className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="relative shrink-0">
                  <span
                    className="flex size-10 items-center justify-center rounded-lg bg-navy-800 text-xs font-semibold text-gold-400"
                    aria-hidden
                  >
                    {SUPERVISOR.initials}
                  </span>
                  {SUPERVISOR.onShift && (
                    <span
                      className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full bg-emerald-500 ring-2 ring-white"
                      aria-label="On shift"
                    />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink-900">
                    {SUPERVISOR.name}
                  </p>
                  <p className="text-xs text-ink-500">
                    {SUPERVISOR.title} ·{" "}
                    {SUPERVISOR.onShift ? "on shift now" : "off shift"}
                  </p>
                </div>
              </div>

              <div className="grid gap-2">
                <Link
                  href="/forums"
                  className="flex min-h-11 items-center justify-between gap-2 rounded-lg border border-line px-3 text-sm font-medium text-ink-700 hover:bg-canvas"
                >
                  <span className="flex items-center gap-2">
                    <MessageCircle className="size-4 text-ink-400" aria-hidden />
                    Ask about a standard
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-ink-400" aria-hidden />
                </Link>
                <Link
                  href="/service-recovery"
                  className="flex min-h-11 items-center justify-between gap-2 rounded-lg border border-rose-100 bg-rose-50 px-3 text-sm font-semibold text-rose-700 hover:bg-rose-100"
                >
                  <span className="flex items-center gap-2">
                    <LifeBuoy className="size-4" aria-hidden />
                    Guest issue right now
                  </span>
                  <ChevronRight className="size-4 shrink-0" aria-hidden />
                </Link>
              </div>
            </PanelBody>
          </Panel>
        </div>
      </div>
    </div>
  );
}
