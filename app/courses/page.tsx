"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ReadinessCheck from "@/components/ReadinessCheck";
import SubNav from "@/components/SubNav";
import { COURSES, getSop } from "@/lib/data";
import { ASSET_ICON } from "@/lib/ui";
import { useStaffState } from "@/lib/store";

/** Operating briefs: the teaching layer bundled around each standard. */
export default function CoursesPage() {
  const { readiness, passReadiness } = useStaffState();

  return (
    <div>
      <PageHeader
        eyebrow="Enablement"
        title="Courses"
        subtitle="Operating briefs assigned to you, each tied to a standard."
      />
      <SubNav />

      <ul className="space-y-4">
        {COURSES.map((course) => {
          const sop = getSop(course.sopId);
          const passed = Boolean(readiness[course.id]);

          return (
            <li key={course.id}>
              <article className="overflow-hidden rounded-xl border border-line bg-surface">
                <div
                  className={`h-1.5 w-full ${passed ? "bg-emerald-600" : "bg-navy-600"}`}
                  aria-hidden
                />

                <div className="p-4 lg:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="text-lg leading-snug font-semibold text-balance text-ink-900">
                        {course.title}
                      </h2>
                      {sop && (
                        <Link
                          href={`/sop/${sop.id}`}
                          className="-mx-2 mt-0.5 inline-flex min-h-11 items-center gap-1 rounded-lg px-2 font-mono text-xs font-bold text-ink-500 hover:bg-canvas hover:text-ink-900"
                        >
                          {sop.code} · {sop.title}
                          <ChevronRight className="size-3.5" aria-hidden />
                        </Link>
                      )}
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        passed
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-sky-50 text-sky-700"
                      }`}
                    >
                      {passed ? "Complete" : "Assigned"}
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-snug text-pretty text-ink-600">
                    {course.summary}
                  </p>

                  <ul className="mt-4 grid gap-2 sm:grid-cols-3">
                    {course.assets.map((asset) => {
                      const Icon = ASSET_ICON[asset.kind];
                      return (
                        <li key={asset.kind}>
                          <button
                            type="button"
                            className="flex min-h-11 w-full items-center gap-2.5 rounded-xl bg-canvas px-3 text-left hover:bg-canvas"
                          >
                            <Icon className="size-5 shrink-0 text-ink-600" aria-hidden />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-bold text-ink-900">
                                {asset.label}
                              </span>
                              <span className="block truncate text-[11px] font-medium text-ink-500">
                                {asset.meta}
                              </span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="mt-5 border-t border-line pt-4">
                    <h3 className="mb-3 text-[11px] font-bold tracking-wide text-ink-400 uppercase">
                      Readiness check
                    </h3>
                    <ReadinessCheck
                      questions={course.readinessCheck}
                      passed={passed}
                      onPass={() => passReadiness(course.id)}
                    />
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
