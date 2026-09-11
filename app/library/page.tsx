"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronRight, Search, Star, Timer, X } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import {
  Button,
  EmptyState,
  Eyebrow,
  Panel,
  inputClass,
} from "@/components/ui/kit";
import { HASHTAGS, JOB_ROLE_LABEL, SOPS, STAFF, stepCount } from "@/lib/data";
import { JOB_ROLE_ICON } from "@/lib/ui";
import type { JobRole } from "@/lib/types";

const ROLES = Object.keys(JOB_ROLE_LABEL) as JobRole[];

function chipClass(active: boolean) {
  return `flex min-h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold whitespace-nowrap transition-colors ${
    active
      ? "border-navy-800 bg-navy-800 text-white"
      : "border-line bg-surface text-ink-600 hover:border-line-strong hover:bg-canvas"
  }`;
}

/** The standards library: search, filter by job role or hashtag, open a SOP. */
export default function LibraryPage() {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<JobRole | "all">(STAFF.jobRole);
  const [tag, setTag] = useState<string | null>(null);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return SOPS.filter((sop) => {
      if (role !== "all" && sop.jobRole !== role) return false;
      if (tag && !sop.hashtags.includes(tag)) return false;
      if (!needle) return true;
      return (
        sop.title.toLowerCase().includes(needle) ||
        sop.code.toLowerCase().includes(needle) ||
        sop.summary.toLowerCase().includes(needle) ||
        sop.hashtags.some((h) => h.includes(needle))
      );
    });
  }, [query, role, tag]);

  const filtered = role !== "all" || tag !== null || query.trim() !== "";

  return (
    <div>
      <PageHeader
        eyebrow="Standards"
        title="SOP library"
        subtitle="The standards behind every task on your floor."
      />

      {/* Filter toolbar */}
      <Panel className="mb-4">
        <div className="space-y-3 p-3 lg:p-4">
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-400"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title, code, or tag"
              aria-label="Search standards"
              className={`${inputClass} pl-9`}
            />
          </div>

          <div className="flex flex-col gap-2.5 lg:flex-row lg:items-start lg:gap-4">
            <div className="min-w-0">
              <Eyebrow className="mb-1.5">Job role</Eyebrow>
              <div className="no-scrollbar -mx-3 overflow-x-auto px-3 lg:mx-0 lg:px-0">
                <ul className="flex w-max gap-1.5">
                  <li>
                    <button
                      type="button"
                      onClick={() => setRole("all")}
                      aria-pressed={role === "all"}
                      className={chipClass(role === "all")}
                    >
                      All roles
                    </button>
                  </li>
                  {ROLES.map((key) => {
                    const Icon = JOB_ROLE_ICON[key];
                    return (
                      <li key={key}>
                        <button
                          type="button"
                          onClick={() => setRole(key)}
                          aria-pressed={role === key}
                          className={chipClass(role === key)}
                        >
                          <Icon className="size-3.5" aria-hidden />
                          {JOB_ROLE_LABEL[key]}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <div className="min-w-0 lg:border-l lg:border-line lg:pl-4">
              <Eyebrow className="mb-1.5">Tag</Eyebrow>
              <div className="no-scrollbar -mx-3 overflow-x-auto px-3 lg:mx-0 lg:px-0">
                <ul className="flex w-max gap-1.5">
                  {HASHTAGS.map((hashtag) => {
                    const active = tag === hashtag;
                    return (
                      <li key={hashtag}>
                        <button
                          type="button"
                          onClick={() => setTag(active ? null : hashtag)}
                          aria-pressed={active}
                          className={`${chipClass(active)} font-mono`}
                        >
                          {hashtag}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-line bg-canvas px-3 py-2 lg:px-4">
          <p className="text-xs font-medium text-ink-500">
            <span className="font-semibold text-ink-900 tnum">{results.length}</span>{" "}
            standard{results.length === 1 ? "" : "s"} shown
          </p>
          {filtered && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setQuery("");
                setRole("all");
                setTag(null);
              }}
            >
              <X className="size-3.5" aria-hidden />
              Clear filters
            </Button>
          )}
        </div>
      </Panel>

      {results.length === 0 ? (
        <EmptyState
          title="No standards match"
          description="Try a different role, tag, or search term."
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setQuery("");
                setRole("all");
                setTag(null);
              }}
            >
              Reset filters
            </Button>
          }
        />
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((sop) => {
            const Icon = JOB_ROLE_ICON[sop.jobRole];
            return (
              <li key={sop.id} className="flex">
                <Panel as="article" className="flex w-full flex-col">
                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex items-start gap-3">
                      <span
                        className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-line bg-canvas text-navy-700"
                        aria-hidden
                      >
                        <Icon className="size-4.5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-mono text-[11px] font-medium text-ink-400">
                          {sop.code}
                        </p>
                        <h2 className="text-sm leading-snug font-semibold text-balance text-ink-900">
                          {sop.title}
                        </h2>
                      </div>
                    </div>

                    <p className="mt-3 text-sm leading-snug text-pretty text-ink-500">
                      {sop.summary}
                    </p>

                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {sop.hashtags.map((hashtag) => (
                        <li
                          key={hashtag}
                          className="rounded border border-line bg-canvas px-1.5 py-0.5 font-mono text-[10px] text-ink-500"
                        >
                          {hashtag}
                        </li>
                      ))}
                    </ul>

                    <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-line pt-3 text-xs text-ink-500">
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="size-3.5 text-ink-400" aria-hidden />
                        <dt className="sr-only">Read time</dt>
                        <dd className="tnum">{sop.readMinutes} min read</dd>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Timer className="size-3.5 text-ink-400" aria-hidden />
                        <dt className="sr-only">Target time</dt>
                        <dd className="tnum">{sop.targetMinutes} min target</dd>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Star className="size-3.5 text-gold-500" aria-hidden />
                        <dt className="sr-only">Quality score</dt>
                        <dd className="tnum">{sop.qualityScore}% quality</dd>
                      </div>
                      <div>
                        <dt className="sr-only">Times used</dt>
                        <dd className="tnum">
                          {sop.usageCount.toLocaleString()} runs
                        </dd>
                      </div>
                    </dl>

                    <p className="mt-2 text-[11px] text-ink-400">
                      {stepCount(sop)} steps across 4 phases
                    </p>

                    <Link
                      href={`/sop/${sop.id}`}
                      className="mt-4 flex min-h-10 items-center justify-between gap-2 rounded-lg border border-line px-3 text-sm font-semibold text-ink-700 transition-colors hover:border-line-strong hover:bg-canvas"
                    >
                      Open standard
                      <ChevronRight className="size-4 shrink-0 text-ink-400" aria-hidden />
                    </Link>
                  </div>
                </Panel>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
