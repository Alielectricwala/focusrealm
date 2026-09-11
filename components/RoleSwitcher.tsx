"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, Lock } from "lucide-react";
import type { RoleKey } from "@/lib/types";

const ROLES: { key: RoleKey; label: string; detail: string }[] = [
  { key: "staff", label: "Staff", detail: "Run the shift" },
  { key: "manager", label: "Manager", detail: "Track the floor" },
  { key: "author", label: "Author", detail: "Write the standards" },
];

/**
 * Wordmark and workspace switcher at the head of the sidebar. Only the Staff
 * workspace is built here; the other two are listed so the switch reads
 * honestly.
 */
export default function RoleSwitcher() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex min-h-12 w-full items-center gap-2.5 rounded-lg px-2 text-left transition-colors hover:bg-navy-800"
      >
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gold-500 text-xs font-bold tracking-tight text-navy-900"
          aria-hidden
        >
          FR
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] leading-tight font-semibold tracking-[0.18em] text-white uppercase">
            Focus Realm
          </span>
          <span className="block truncate text-xs leading-tight text-navy-300">
            Staff workspace
          </span>
        </span>
        <ChevronsUpDown className="size-4 shrink-0 text-navy-300" aria-hidden />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close workspace menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <ul
            role="menu"
            className="absolute z-50 mt-1.5 w-full min-w-56 overflow-hidden rounded-lg border border-line bg-surface p-1 shadow-overlay"
          >
            {ROLES.map((role) => {
              const current = role.key === "staff";
              return (
                <li key={role.key}>
                  <button
                    type="button"
                    role="menuitem"
                    disabled={!current}
                    onClick={() => setOpen(false)}
                    className={`flex min-h-11 w-full items-center gap-3 rounded-md px-2.5 text-left ${
                      current
                        ? "bg-canvas text-ink-900"
                        : "cursor-not-allowed text-ink-400"
                    }`}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold">
                        {role.label}
                      </span>
                      <span className="block text-xs opacity-80">
                        {current ? role.detail : "Not part of this build"}
                      </span>
                    </span>
                    {current ? (
                      <Check className="size-4 shrink-0 text-emerald-600" aria-hidden />
                    ) : (
                      <Lock className="size-3.5 shrink-0" aria-hidden />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
