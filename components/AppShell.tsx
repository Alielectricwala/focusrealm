"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  ChevronRight,
  LifeBuoy,
  Menu,
  Search,
  X,
} from "lucide-react";
import RoleSwitcher from "./RoleSwitcher";
import { NAV, NAV_GROUPS, crumbsFor, isActive } from "@/lib/nav";
import { NOTIFICATIONS, STAFF, SUPERVISOR } from "@/lib/data";
import { useStaffState } from "@/lib/store";
import { Eyebrow } from "./ui/kit";

/* -------------------------------------------------------------------------- */
/* Pieces                                                                     */
/* -------------------------------------------------------------------------- */

function Avatar({
  initials,
  className = "",
  onShift,
}: {
  initials: string;
  className?: string;
  onShift?: boolean;
}) {
  return (
    <span className="relative shrink-0">
      <span
        className={`flex items-center justify-center rounded-lg bg-navy-700 text-xs font-semibold tracking-wide text-gold-400 ring-1 ring-navy-500 ${className}`}
        aria-hidden
      >
        {initials}
      </span>
      {onShift && (
        <span
          className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full bg-emerald-400 ring-2 ring-navy-900"
          aria-label="On shift"
        />
      )}
    </span>
  );
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { readNotifications } = useStaffState();
  const unread = NOTIFICATIONS.filter(
    (n) => !readNotifications.includes(n.id),
  ).length;

  return (
    <nav aria-label="Sections" className="flex flex-1 flex-col gap-6 overflow-y-auto py-2">
      {NAV_GROUPS.map((group) => (
        <div key={group.label}>
          <Eyebrow tone="onDark" className="px-3 pb-2">
            {group.label}
          </Eyebrow>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = isActive(pathname, item);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={`group relative flex min-h-10 items-center gap-2.5 rounded-lg px-3 text-sm font-medium transition-colors ${
                      active
                        ? "bg-navy-700 font-semibold text-white"
                        : "text-navy-300 hover:bg-navy-800 hover:text-white"
                    }`}
                  >
                    {active && (
                      <span
                        className="absolute inset-y-1.5 -left-px w-0.5 rounded-full bg-gold-500"
                        aria-hidden
                      />
                    )}
                    <item.Icon
                      className={`size-4 shrink-0 ${active ? "text-gold-400" : ""}`}
                      aria-hidden
                    />
                    <span className="truncate">{item.label}</span>
                    {item.href === "/courses" && unread > 0 && (
                      <span className="ml-auto rounded-md bg-gold-500 px-1.5 py-0.5 text-[10px] font-semibold text-navy-900 tnum">
                        {unread}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function AssignmentCard() {
  return (
    <dl className="space-y-2 rounded-lg border border-navy-700 bg-navy-800/70 p-3 text-xs">
      <div className="flex items-center justify-between gap-2">
        <dt className="text-navy-300">Property</dt>
        <dd className="truncate font-medium text-white">{STAFF.property}</dd>
      </div>
      <div className="flex items-center justify-between gap-2">
        <dt className="text-navy-300">Department</dt>
        <dd className="font-medium text-white">{STAFF.department}</dd>
      </div>
      <div className="flex items-center justify-between gap-2">
        <dt className="text-navy-300">Shift</dt>
        <dd className="font-medium text-white tnum">{STAFF.shiftLabel}</dd>
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-navy-700 pt-2">
        <dt className="text-navy-300">Supervisor</dt>
        <dd className="flex items-center gap-1.5 font-medium text-white">
          {SUPERVISOR.onShift && (
            <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden />
          )}
          {SUPERVISOR.name}
        </dd>
      </div>
    </dl>
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <div className="border-b border-navy-700 px-3 py-3">
        <RoleSwitcher />
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-3">
        <SidebarNav onNavigate={onNavigate} />
      </div>

      <div className="space-y-3 border-t border-navy-700 px-3 py-3">
        <AssignmentCard />
        <div className="flex items-center gap-2.5">
          <Avatar initials={STAFF.initials} className="size-9" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm leading-tight font-semibold text-white">
              {STAFF.name}
            </span>
            <span className="block truncate text-xs leading-tight text-navy-300">
              {STAFF.title}
            </span>
          </span>
        </div>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Shell                                                                      */
/* -------------------------------------------------------------------------- */

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { readNotifications } = useStaffState();
  const [drawer, setDrawer] = useState(false);

  // The intern onboarding module is a separate internal tool — it brings its
  // own chrome on the same brand.
  if (pathname.startsWith("/onboarding")) return <>{children}</>;

  const unread = NOTIFICATIONS.filter(
    (n) => !readNotifications.includes(n.id),
  ).length;
  const crumbs = crumbsFor(pathname);

  return (
    <div className="flex min-h-full flex-col lg:flex-row">
      {/* Sidebar — desktop */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-navy-700 bg-navy-900 lg:fixed lg:inset-y-0 lg:flex">
        <SidebarBody />
      </aside>

      {/* Sidebar — mobile drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setDrawer(false)}
            className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-navy-900 shadow-overlay">
            <SidebarBody onNavigate={() => setDrawer(false)} />
          </div>
          <button
            type="button"
            onClick={() => setDrawer(false)}
            aria-label="Close navigation"
            className="absolute top-3 right-3 flex size-10 items-center justify-center rounded-lg bg-navy-800 text-white"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        {/* Console top bar */}
        <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur">
          <div className="flex items-center gap-2 px-3 py-2.5 lg:px-6">
            <button
              type="button"
              onClick={() => setDrawer(true)}
              aria-label="Open navigation"
              className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-line text-ink-700 hover:bg-canvas lg:hidden"
            >
              <Menu className="size-5" aria-hidden />
            </button>

            <nav
              aria-label="Breadcrumb"
              className="no-scrollbar min-w-0 flex-1 overflow-x-auto"
            >
              <ol className="flex items-center gap-1.5 text-xs whitespace-nowrap">
                {crumbs.map((crumb, index) => {
                  const last = index === crumbs.length - 1;
                  return (
                    <li key={crumb.href} className="flex items-center gap-1.5">
                      {index > 0 && (
                        <ChevronRight
                          className="size-3.5 shrink-0 text-ink-400"
                          aria-hidden
                        />
                      )}
                      {last ? (
                        <span
                          aria-current="page"
                          className="font-semibold text-ink-900"
                        >
                          {crumb.label}
                        </span>
                      ) : (
                        <Link
                          href={crumb.href}
                          className="font-medium text-ink-500 hover:text-ink-900"
                        >
                          {crumb.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>

            <Link
              href="/library"
              className="hidden min-h-9 items-center gap-2 rounded-lg border border-line px-3 text-xs font-medium text-ink-400 hover:border-line-strong hover:text-ink-700 md:flex"
            >
              <Search className="size-4" aria-hidden />
              Search standards
              <kbd className="ml-6 rounded border border-line bg-canvas px-1.5 py-0.5 font-mono text-[10px] text-ink-400">
                /
              </kbd>
            </Link>

            <Link
              href="/service-recovery"
              className="hidden min-h-9 items-center gap-2 rounded-lg border border-rose-100 bg-rose-50 px-3 text-xs font-semibold text-rose-700 hover:bg-rose-100 sm:flex"
            >
              <LifeBuoy className="size-4" aria-hidden />
              Service recovery
            </Link>

            <Link
              href="/notifications"
              aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ""}`}
              className="relative flex size-10 shrink-0 items-center justify-center rounded-lg border border-line text-ink-700 hover:bg-canvas"
            >
              <Bell className="size-4.5" aria-hidden />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 flex min-w-4.5 items-center justify-center rounded-full bg-gold-500 px-1 text-[10px] leading-4.5 font-semibold text-navy-900 tnum">
                  {unread}
                </span>
              )}
            </Link>

            <span className="hidden h-8 w-px bg-line lg:block" aria-hidden />

            <div className="hidden items-center gap-2.5 lg:flex">
              <span className="text-right">
                <span className="block text-xs leading-tight font-semibold text-ink-900">
                  {STAFF.name}
                </span>
                <span className="block text-[11px] leading-tight text-ink-500">
                  {STAFF.title}
                </span>
              </span>
              <Avatar initials={STAFF.initials} className="size-9" />
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-5 pb-28 lg:px-6 lg:py-7 lg:pb-10">
          {children}
        </main>

        <footer className="hidden border-t border-line px-6 py-3 text-[11px] text-ink-400 lg:block">
          Focus Realm · Service Execution Platform — {STAFF.property}
        </footer>
      </div>

      {/* Bottom bar — mobile and tablet */}
      <nav
        aria-label="Sections"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur lg:hidden"
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
                  className={`relative flex min-h-14 flex-col items-center justify-center gap-1 px-1 py-2 ${
                    active ? "text-navy-800" : "text-ink-400"
                  }`}
                >
                  {active && (
                    <span
                      className="absolute inset-x-4 top-0 h-0.5 rounded-full bg-gold-500"
                      aria-hidden
                    />
                  )}
                  <item.Icon className="size-5" aria-hidden />
                  <span className="text-[10px] leading-none font-semibold">
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
