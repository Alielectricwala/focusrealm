import Link from "next/link";
import { ChevronRight, Clock, Sparkles } from "lucide-react";
import FlagChips from "./FlagChips";
import { Badge, Eyebrow, Panel } from "./ui/kit";
import { getSop } from "@/lib/data";
import { STATUS } from "@/lib/ui";
import type { ShiftTask } from "@/lib/types";

/** One timed room task in the duty plan. */
export default function ShiftTaskCard({ task }: { task: ShiftTask }) {
  const sop = getSop(task.sopId);
  const tone = STATUS[task.status];

  return (
    <Panel as="article" accent={tone.solid} className="flex h-full flex-col">
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Eyebrow className="mb-1">Room</Eyebrow>
            <p className="text-2xl leading-none font-semibold tracking-tight text-ink-900 tnum">
              {task.room}
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <Badge tone={tone.badge} dot={tone.solid}>
              {tone.label}
            </Badge>
            <p className="flex items-center gap-1 text-[11px] font-medium text-ink-500 tnum">
              <Clock className="size-3.5 text-ink-400" aria-hidden />
              {task.dueAt}
            </p>
          </div>
        </div>

        {sop && (
          <p className="text-sm leading-snug font-medium text-ink-700">
            <span className="font-mono text-xs text-ink-400">{sop.code}</span>{" "}
            {sop.title}
          </p>
        )}

        <FlagChips flags={task.flags} />

        <p className="flex items-start gap-2 rounded-lg border border-gold-100 bg-gold-50 p-2.5 text-xs leading-snug text-ink-700">
          <Sparkles className="mt-0.5 size-3.5 shrink-0 text-gold-600" aria-hidden />
          <span>
            <span className="font-semibold text-gold-600">Five-star cue · </span>
            {task.fiveStarCue}
          </span>
        </p>

        {sop && (
          <Link
            href={`/sop/${sop.id}`}
            className="mt-auto flex min-h-10 items-center justify-between gap-2 rounded-lg border border-line px-3 text-sm font-semibold text-ink-700 transition-colors hover:border-line-strong hover:bg-canvas"
          >
            Open standard
            <ChevronRight className="size-4 shrink-0 text-ink-400" aria-hidden />
          </Link>
        )}
      </div>
    </Panel>
  );
}
