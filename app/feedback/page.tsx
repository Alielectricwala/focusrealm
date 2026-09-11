"use client";

import { useState } from "react";
import { Check, Send, Star } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import SubNav from "@/components/SubNav";
import { COURSES, getSop } from "@/lib/data";
import { useStaffState } from "@/lib/store";

const SUGGESTIONS = [
  "Add a photo of the finished standard",
  "The video is too long",
  "A step is missing",
  "Wording is hard to follow",
  "Does not match how the floor actually runs",
];

/** Rate a brief's usefulness and route a suggestion back to its author. */
export default function FeedbackPage() {
  const { feedbackSent, sendFeedback } = useStaffState();
  const [courseId, setCourseId] = useState(COURSES[0].id);
  const [rating, setRating] = useState(0);
  const [picked, setPicked] = useState<string[]>([]);
  const [note, setNote] = useState("");

  const course = COURSES.find((c) => c.id === courseId);
  const sop = course ? getSop(course.sopId) : undefined;

  if (feedbackSent) {
    return (
      <div>
        <PageHeader title="Feedback" subtitle="Sent to the standard's author." />
        <SubNav />
        <div className="rounded-xl border border-emerald-200 bg-surface p-10 text-center">
          <span className="mise-pop mx-auto flex size-20 items-center justify-center rounded-full bg-emerald-600">
            <Check className="size-11 text-white" strokeWidth={3} aria-hidden />
          </span>
          <p className="mt-4 text-lg font-semibold text-ink-900">Feedback sent</p>
          <p className="mt-1 text-sm text-ink-500">
            It is with the author of {sop?.code ?? "the standard"}. You will see
            any change in your notifications.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="Enablement"
        title="Feedback"
        subtitle="Tell the author what would make this brief work on the floor."
      />
      <SubNav />

      <div className="mx-auto max-w-2xl space-y-5">
        <section className="rounded-xl border border-line bg-surface p-4">
          <label
            htmlFor="brief"
            className="mb-2 block text-[11px] font-bold tracking-wide text-ink-400 uppercase"
          >
            Which brief
          </label>
          <select
            id="brief"
            value={courseId}
            onChange={(event) => setCourseId(event.target.value)}
            className="min-h-11 w-full rounded-xl border border-line bg-surface px-4 text-base font-semibold text-ink-900 focus:border-navy-600 focus:outline-none"
          >
            {COURSES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
          {sop && (
            <p className="mt-2 font-mono text-xs font-bold text-ink-400">
              Routes to the author of {sop.code}
            </p>
          )}
        </section>

        <section className="rounded-xl border border-line bg-surface p-4">
          <p className="mb-3 text-[11px] font-bold tracking-wide text-ink-400 uppercase">
            How useful was it
          </p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                aria-label={`${value} out of 5`}
                aria-pressed={rating === value}
                className={`flex size-14 flex-1 items-center justify-center rounded-xl transition-colors ${
                  value <= rating
                    ? "bg-gold-50 text-gold-500"
                    : "bg-canvas text-ink-400"
                }`}
              >
                <Star
                  className="size-7"
                  strokeWidth={2}
                  fill={value <= rating ? "currentColor" : "none"}
                  aria-hidden
                />
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-line bg-surface p-4">
          <p className="mb-3 text-[11px] font-bold tracking-wide text-ink-400 uppercase">
            What would you change
          </p>
          <ul className="space-y-2">
            {SUGGESTIONS.map((suggestion) => {
              const active = picked.includes(suggestion);
              return (
                <li key={suggestion}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() =>
                      setPicked((prev) =>
                        active
                          ? prev.filter((p) => p !== suggestion)
                          : [...prev, suggestion],
                      )
                    }
                    className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-4 text-left text-sm font-semibold ${
                      active
                        ? "bg-navy-800 text-white"
                        : "bg-canvas text-ink-700 ring-1 ring-line"
                    }`}
                  >
                    <span
                      className={`flex size-6 shrink-0 items-center justify-center rounded-md ${
                        active ? "bg-surface text-ink-900" : "ring-2 ring-line-strong"
                      }`}
                      aria-hidden
                    >
                      {active && <Check className="size-3.5" strokeWidth={3} />}
                    </span>
                    {suggestion}
                  </button>
                </li>
              );
            })}
          </ul>

          <label htmlFor="note" className="mt-4 mb-2 block text-sm font-bold text-ink-700">
            Anything else
          </label>
          <textarea
            id="note"
            rows={4}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Optional — what happened on the floor?"
            className="w-full rounded-xl border border-line bg-surface p-4 text-base text-ink-900 placeholder:text-ink-400 focus:border-navy-600 focus:outline-none"
          />
        </section>

        <button
          type="button"
          onClick={sendFeedback}
          disabled={rating === 0}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-navy-800 text-base font-bold text-white disabled:bg-line disabled:text-ink-400"
        >
          <Send className="size-5" aria-hidden />
          Send to author
        </button>
      </div>
    </div>
  );
}
