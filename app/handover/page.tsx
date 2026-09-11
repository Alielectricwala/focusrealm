"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Ban,
  Check,
  CircleAlert,
  HandHeart,
  Send,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { HANDOVER, STAFF } from "@/lib/data";
import { useStaffState } from "@/lib/store";
import type { HandoverItem } from "@/lib/types";

function ItemList({
  items,
  tone,
}: {
  items: HandoverItem[];
  tone: string;
}) {
  return (
    <ul className="divide-y divide-line">
      {items.map((item) => (
        <li key={item.id} className="flex items-start gap-3 p-4">
          <span
            className={`flex size-11 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-semibold ${tone}`}
            aria-hidden
          >
            {item.room}
          </span>
          <p className="pt-1 text-sm leading-snug text-pretty text-ink-700">
            {item.detail}
          </p>
        </li>
      ))}
    </ul>
  );
}

/** Passing unfinished work, promises and blocks to the next shift. */
export default function HandoverPage() {
  const { handoverChecks, toggleHandoverCheck, handoverSent, sendHandover } =
    useStaffState();

  const ready = HANDOVER.checklist.every((item) => handoverChecks[item.id]);
  const checkedCount = HANDOVER.checklist.filter(
    (item) => handoverChecks[item.id],
  ).length;

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/shift"
        className="mb-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-surface px-4 text-sm font-bold text-ink-700 ring-1 ring-line hover:bg-canvas"
      >
        <ArrowLeft className="size-5" aria-hidden />
        My shift
      </Link>

      <PageHeader
        eyebrow="Operations"
        title="Shift handover"
        subtitle={`Everything the evening team needs from your ${STAFF.shiftLabel}.`}
      />

      {handoverSent && (
        <p className="mise-pop mb-5 flex min-h-11 items-center gap-3 rounded-xl bg-emerald-600 px-4 font-bold text-white">
          <Check className="size-6 shrink-0" strokeWidth={3} aria-hidden />
          Handover sent to the evening team
        </p>
      )}

      <div className="space-y-4">
        <section className="overflow-hidden rounded-xl border border-line bg-surface">
          <header className="flex items-center gap-2 border-b border-line p-4">
            <CircleAlert className="size-5 text-gold-500" aria-hidden />
            <h2 className="flex-1 text-base font-semibold text-ink-900">
              Unfinished work
            </h2>
            <span className="font-mono text-sm font-semibold text-ink-400">
              {HANDOVER.unfinished.length}
            </span>
          </header>
          <ItemList items={HANDOVER.unfinished} tone="bg-gold-50 text-gold-600" />
        </section>

        <section className="overflow-hidden rounded-xl border border-line bg-surface">
          <header className="flex items-center gap-2 border-b border-line p-4">
            <HandHeart className="size-5 text-violet-500" aria-hidden />
            <h2 className="flex-1 text-base font-semibold text-ink-900">
              Guest promises
            </h2>
            <span className="font-mono text-sm font-semibold text-ink-400">
              {HANDOVER.guestPromises.length}
            </span>
          </header>
          <ItemList
            items={HANDOVER.guestPromises}
            tone="bg-indigo-50 text-violet-900"
          />
        </section>

        <section className="overflow-hidden rounded-xl border border-line bg-surface">
          <header className="flex items-center gap-2 border-b border-line p-4">
            <Ban className="size-5 text-rose-500" aria-hidden />
            <h2 className="flex-1 text-base font-semibold text-ink-900">
              Blocked rooms
            </h2>
            <span className="font-mono text-sm font-semibold text-ink-400">
              {HANDOVER.blockedRooms.length}
            </span>
          </header>
          <ItemList items={HANDOVER.blockedRooms} tone="bg-rose-100 text-rose-900" />
        </section>

        <section className="overflow-hidden rounded-xl border border-line bg-surface">
          <header className="flex items-center gap-2 border-b border-line p-4">
            <h2 className="flex-1 text-base font-semibold text-ink-900">
              Before you send
            </h2>
            <span className="font-mono text-sm font-semibold text-ink-400">
              {checkedCount}/{HANDOVER.checklist.length}
            </span>
          </header>

          <ul className="divide-y divide-line">
            {HANDOVER.checklist.map((item) => {
              const checked = Boolean(handoverChecks[item.id]);
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={checked}
                    onClick={() => toggleHandoverCheck(item.id)}
                    disabled={handoverSent}
                    className="flex min-h-11 w-full items-center gap-3 p-4 text-left disabled:opacity-60"
                  >
                    <span
                      className={`flex size-7 shrink-0 items-center justify-center rounded-lg ${
                        checked
                          ? "bg-emerald-600 text-white"
                          : "ring-2 ring-line-strong"
                      }`}
                      aria-hidden
                    >
                      {checked && <Check className="size-4" strokeWidth={3} />}
                    </span>
                    <span
                      className={`flex-1 text-sm leading-snug font-semibold text-pretty ${
                        checked ? "text-ink-400 line-through" : "text-ink-900"
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <button
          type="button"
          onClick={sendHandover}
          disabled={!ready || handoverSent}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-navy-800 text-base font-bold text-white disabled:bg-line disabled:text-ink-400"
        >
          <Send className="size-5" aria-hidden />
          {handoverSent
            ? "Handover sent"
            : ready
              ? "Send handover"
              : `Complete the checklist (${checkedCount}/${HANDOVER.checklist.length})`}
        </button>
      </div>
    </div>
  );
}
