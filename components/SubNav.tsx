"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { COURSE_SUBNAV } from "@/lib/nav";

/** Tab strip inside the Courses section. Scrolls horizontally on mobile. */
export default function SubNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Courses sections"
      className="no-scrollbar -mx-4 mb-5 overflow-x-auto border-b border-line px-4 lg:mx-0 lg:px-0"
    >
      <ul className="flex w-max gap-1">
        {COURSE_SUBNAV.map((item) => {
          const active = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`-mb-px flex min-h-10 items-center border-b-2 px-3 text-sm whitespace-nowrap transition-colors ${
                  active
                    ? "border-gold-500 font-semibold text-ink-900"
                    : "border-transparent font-medium text-ink-500 hover:border-line-strong hover:text-ink-900"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
