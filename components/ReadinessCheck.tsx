"use client";

import { useMemo, useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import type { QuizQuestion } from "@/lib/types";

interface Props {
  questions: QuizQuestion[];
  passed: boolean;
  onPass: () => void;
}

/** The inline multiple-choice check that closes an operating brief. */
export default function ReadinessCheck({ questions, passed, onPass }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);

  const allAnswered = questions.every((q) => answers[q.id]);
  const wrong = useMemo(
    () =>
      questions.filter(
        (q) => !q.options.find((o) => o.id === answers[q.id])?.correct,
      ),
    [questions, answers],
  );

  if (passed) {
    return (
      <div className="flex min-h-12 items-center gap-3 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
          <Check className="size-4" strokeWidth={3} aria-hidden />
        </span>
        <p className="text-sm font-semibold text-emerald-800">Readiness check passed</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map((question, index) => {
        const chosen = answers[question.id];
        const isWrong = checked && wrong.some((q) => q.id === question.id);

        return (
          <fieldset key={question.id} className="space-y-2">
            <legend className="mb-2 flex items-start gap-2.5 text-sm font-semibold text-ink-900">
              <span
                className="mt-px flex size-5 shrink-0 items-center justify-center rounded bg-navy-800 font-mono text-[10px] text-white"
                aria-hidden
              >
                {index + 1}
              </span>
              <span className="text-pretty">{question.prompt}</span>
            </legend>

            {question.options.map((option) => {
              const selected = chosen === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    setChecked(false);
                    setAnswers((prev) => ({ ...prev, [question.id]: option.id }));
                  }}
                  className={`flex min-h-11 w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                    selected
                      ? isWrong
                        ? "border-rose-300 bg-rose-50 text-rose-800"
                        : "border-navy-800 bg-navy-800 font-semibold text-white"
                      : "border-line bg-surface text-ink-700 hover:border-line-strong hover:bg-canvas"
                  }`}
                >
                  <span
                    className={`flex size-5 shrink-0 items-center justify-center rounded-full ${
                      selected
                        ? isWrong
                          ? "bg-rose-600 text-white"
                          : "bg-gold-500 text-navy-900"
                        : "ring-1 ring-line-strong"
                    }`}
                    aria-hidden
                  >
                    {selected &&
                      (isWrong ? (
                        <X className="size-3.5" strokeWidth={3} />
                      ) : (
                        <Check className="size-3.5" strokeWidth={3} />
                      ))}
                  </span>
                  <span className="text-pretty">{option.label}</span>
                </button>
              );
            })}
          </fieldset>
        );
      })}

      {checked && wrong.length > 0 ? (
        <button
          type="button"
          onClick={() => {
            setAnswers({});
            setChecked(false);
          }}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-rose-600 text-sm font-semibold text-white hover:bg-rose-700"
        >
          <RotateCcw className="size-4" aria-hidden />
          {wrong.length} to review — try again
        </button>
      ) : (
        <button
          type="button"
          onClick={() => {
            setChecked(true);
            if (wrong.length === 0) onPass();
          }}
          disabled={!allAnswered}
          className="flex min-h-11 w-full items-center justify-center rounded-lg bg-navy-800 text-sm font-semibold text-white transition-colors hover:bg-navy-700 disabled:bg-canvas disabled:text-ink-400"
        >
          Submit readiness check
        </button>
      )}
    </div>
  );
}
