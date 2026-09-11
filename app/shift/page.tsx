"use client";

import { ArrowRight, Clock, MessageSquareQuote, Play } from "lucide-react";
import Countdown from "@/components/Countdown";
import FlagChips from "@/components/FlagChips";
import PageHeader from "@/components/PageHeader";
import ProgressRing from "@/components/ProgressRing";
import ShiftTaskCard from "@/components/ShiftTaskCard";
import {
  Badge,
  ButtonLink,
  Eyebrow,
  Metric,
  MetricRow,
  Panel,
  PanelBody,
  PanelHeader,
  SectionHeading,
} from "@/components/ui/kit";
import {
  ACTIVE_TASK,
  SHIFT_GLANCE,
  SHIFT_TASKS,
  STAFF,
  SUPERVISOR,
  SUPERVISOR_NOTE,
  getSop,
} from "@/lib/data";
import { STATUS } from "@/lib/ui";

/** My shift: the live task, the day's numbers, and every timed room task. */
export default function ShiftPage() {
  const activeSop = getSop(ACTIVE_TASK.sopId);
  const released = SHIFT_TASKS.filter((t) => t.status === "complete").length;

  return (
    <div>
      <PageHeader
        eyebrow="Operations"
        title="My shift"
        subtitle={`${STAFF.shiftDay} ${STAFF.shiftLabel} · ${STAFF.department} · ${STAFF.property}`}
        action={
          <ButtonLink href="/handover" variant="secondary">
            Shift handover
            <ArrowRight className="size-4" aria-hidden />
          </ButtonLink>
        }
      />

      {/* Numbers first — this is the operational summary line. */}
      <Panel className="mb-5">
        <MetricRow className="grid-cols-2 divide-y divide-line lg:grid-cols-4 lg:divide-y-0">
          <Metric
            label="Rooms released"
            value={SHIFT_GLANCE.roomsReleased}
            suffix={`/ ${SHIFT_GLANCE.roomsTotal}`}
          />
          <Metric
            label="On-time pace"
            value={`${SHIFT_GLANCE.onTimePace}%`}
            tone="positive"
          />
          <Metric label="Timed tasks" value={SHIFT_TASKS.length} hint={`${released} closed`} />
          <div className="min-w-0">
            <Eyebrow>Arrival pressure</Eyebrow>
            <p className="mt-1.5 text-sm leading-snug font-medium text-ink-700">
              {SHIFT_GLANCE.arrivalPressure}
            </p>
          </div>
        </MetricRow>
      </Panel>

      <div className="mb-5 grid gap-5 lg:grid-cols-3 lg:items-start">
        {/* Live task */}
        <Panel
          accent={STATUS.active.solid}
          aria-labelledby="live-task"
          className="lg:col-span-2"
        >
          <PanelHeader
            id="live-task"
            eyebrow="Live now"
            title="Room in progress"
            action={
              <Badge tone="gold" dot="bg-gold-500">
                Due {ACTIVE_TASK.dueAt}
              </Badge>
            }
          />
          <PanelBody>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <ProgressRing percent={ACTIVE_TASK.percent ?? 0} sublabel="complete" />

              <div className="min-w-0 flex-1">
                <Eyebrow className="mb-1.5">Room</Eyebrow>
                <p className="text-3xl leading-none font-semibold tracking-tight text-ink-900 tnum">
                  {ACTIVE_TASK.room}
                </p>
                {activeSop && (
                  <p className="mt-2 text-sm font-medium text-ink-700">
                    <span className="font-mono text-xs text-ink-400">
                      {activeSop.code}
                    </span>{" "}
                    {activeSop.title}
                  </p>
                )}
                <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-ink-900">
                  <Clock className="size-4 text-ink-400" aria-hidden />
                  <Countdown seconds={ACTIVE_TASK.remainingSeconds ?? 0} />
                  <span className="font-normal text-ink-500">
                    left · due {ACTIVE_TASK.dueAt}
                  </span>
                </p>
                <div className="mt-3">
                  <FlagChips flags={ACTIVE_TASK.flags} size="md" />
                </div>
              </div>

              {activeSop && (
                <ButtonLink
                  href={`/sop/${activeSop.id}/practice`}
                  variant="gold"
                  className="shrink-0"
                >
                  <Play className="size-4" aria-hidden />
                  Continue
                </ButtonLink>
              )}
            </div>
          </PanelBody>
        </Panel>

        {/* Supervisor note */}
        <section
          aria-labelledby="note"
          className="rounded-xl border border-navy-700 bg-navy-900 p-4 lg:p-5"
        >
          <h2
            id="note"
            className="mb-2.5 flex items-center gap-2 text-[10px] font-semibold tracking-[0.14em] text-navy-300 uppercase"
          >
            <MessageSquareQuote className="size-3.5 text-gold-400" aria-hidden />
            Note from {SUPERVISOR.name}
          </h2>
          <p className="text-sm leading-relaxed text-pretty text-white/90">
            {SUPERVISOR_NOTE}
          </p>
          <p className="mt-3 border-t border-navy-700 pt-3 text-xs text-navy-300">
            {SUPERVISOR.title} · {SUPERVISOR.onShift ? "on shift now" : "off shift"}
          </p>
        </section>
      </div>

      {/* Duty plan */}
      <section aria-labelledby="plan">
        <SectionHeading
          id="plan"
          title="Duty plan"
          meta={`${SHIFT_TASKS.length} timed tasks`}
        />
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {SHIFT_TASKS.map((task) => (
            <li key={task.id} className="flex">
              <div className="w-full">
                <ShiftTaskCard task={task} />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
