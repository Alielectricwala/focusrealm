"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import RoleSwitcher from "./RoleSwitcher";
import { NAV, isActive } from "@/lib/nav";
import { NOTIFICATIONS, STAFF, SUPERVISOR } from "@/lib/data";
import { useStaffState } from "@/lib/store";

function StaffIdentity({ dark }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="flex size-11 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-black text-white"
        aria-hidden
      >
        {STAFF.initials}
      </span>
      <span className="min-w-0">
        <span
          className={`block truncate text-sm leading-tight font-bold ${dark ? "text-white" : "text-stone-900"}`}
        >
          {STAFF.name}
        </span>
        <span
          className={`block truncate text-xs leading-tight font-medium ${dark ? "text-white/60" : "text-stone-500"}`}
        >
          {STAFF.title}
        </span>
      </span>
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { readNotifications } = useStaffState();

  // The intern onboarding module is a separate internal tool, not part of the
  // hospitality product demo — it brings its own chrome.
  if (pathname.startsWith("/onboarding")) return <>{children}</>;
  const unread = NOTIFICATIONS.filter(
    (n) => !readNotifications.includes(n.id),
  ).length;

  return (
    <div className="flex min-h-full flex-col lg:flex-row">
      {/* Sidebar — desktop only */}
      <aside className="hidden w-72 shrink-0 flex-col gap-6 border-r border-stone-800 bg-stone-900 p-4 lg:fixed lg:inset-y-0 lg:flex lg:overflow-y-auto">
        <RoleSwitcher dark />

        <div className="space-y-3 rounded-2xl bg-white/5 p-3">
          <StaffIdentity dark />
          <dl className="space-y-1 text-xs">
            <div className="flex justify-between gap-2">
              <dt className="text-white/50">Property</dt>
              <dd className="truncate font-semibold text-white/90">
                {STAFF.property}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-white/50">Department</dt>
              <dd className="font-semibold text-white/90">{STAFF.department}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-white/50">Shift</dt>
              <dd className="font-semibold text-white/90">
                {STAFF.shiftDay} {STAFF.shiftLabel}
              </dd>
            </div>
          </dl>
        </div>

        <nav aria-label="Sections" className="flex flex-1 flex-col gap-1">
          {NAV.map((item) => {
            const active = isActive(pathname, item);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-14 items-center gap-3 rounded-xl px-3 text-sm font-bold transition-colors ${
                  active
                    ? "bg-white text-stone-900"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.Icon className="size-5 shrink-0" aria-hidden />
                {item.label}
                {item.href === "/courses" && unread > 0 && (
                  <span className="ml-auto flex size-6 items-center justify-center rounded-full bg-rose-500 text-xs font-black text-white">
                    {unread}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="rounded-2xl bg-white/5 p-3">
          <p className="mb-2 text-xs font-bold text-white/50 uppercase">
            On shift with you
          </p>
          <div className="flex items-center gap-3">
            <span className="relative shrink-0">
              <span
                className="flex size-10 items-center justify-center rounded-full bg-stone-700 text-xs font-black text-white"
                aria-hidden
              >
                {SUPERVISOR.initials}
              </span>
              {SUPERVISOR.onShift && (
                <span
                  className="absolute -right-0.5 -bottom-0.5 size-3.5 rounded-full bg-emerald-400 ring-2 ring-stone-900"
                  aria-label="On shift"
                />
              )}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm leading-tight font-bold text-white">
                {SUPERVISOR.name}
              </span>
              <span className="block truncate text-xs text-white/60">
                {SUPERVISOR.title}
              </span>
            </span>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/95 backdrop-blur lg:hidden">
        <div className="flex items-center gap-3 px-4 py-2.5">
          <div className="min-w-0 flex-1">
            <StaffIdentity />
          </div>
          <Link
            href="/notifications"
            aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ""}`}
            className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl bg-stone-100 text-stone-700 active:bg-stone-200"
          >
            <Bell className="size-6" aria-hidden />
            {unread > 0 && (
              <span className="absolute top-2 right-2 flex size-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white">
                {unread}
              </span>
            )}
          </Link>
        </div>
        <div className="flex items-center gap-2 border-t border-stone-100 px-4 py-1.5 text-xs font-medium text-stone-500">
          <span className="truncate">{STAFF.property}</span>
          <span className="text-stone-300">·</span>
          <span className="shrink-0">{STAFF.department}</span>
          <span className="text-stone-300">·</span>
          <span className="shrink-0">{STAFF.shiftLabel}</span>
        </div>
      </header>

      <div className="flex min-w-0 flex-1 flex-col lg:pl-72">
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-5 pb-28 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>

      {/* Bottom bar — mobile and tablet */}
      <nav
        aria-label="Sections"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white/95 backdrop-blur lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <ul className="mx-auto flex max-w-2xl">
          {NAV.map((item) => {
            const active = isActive(pathname, item);
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-16 flex-col items-center justify-center gap-1 px-1 py-2 ${
                    active ? "text-stone-900" : "text-stone-400"
                  }`}
                >
                  <item.Icon
                    className="size-6"
                    strokeWidth={active ? 2.6 : 2}
                    aria-hidden
                  />
                  <span className="text-[11px] leading-none font-bold">
                    {item.short}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
