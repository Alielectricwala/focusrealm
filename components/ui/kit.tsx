import Link from "next/link";
import type { ComponentProps, ElementType, ReactNode } from "react";

/**
 * Focus Realm console kit.
 *
 * Every screen in the product is assembled from these primitives so the
 * console reads as one system: flat panels on a cool canvas, a 1px rule
 * instead of shadow, navy for structure and gold reserved for the single
 * most important action or state on a screen.
 */

/* -------------------------------------------------------------------------- */
/* Text                                                                       */
/* -------------------------------------------------------------------------- */

export function Eyebrow({
  children,
  tone = "muted",
  className = "",
}: {
  children: ReactNode;
  tone?: "muted" | "gold" | "onDark";
  className?: string;
}) {
  const colour =
    tone === "gold"
      ? "text-gold-600"
      : tone === "onDark"
        ? "text-navy-300"
        : "text-ink-400";
  return (
    <p
      className={`text-[10px] leading-none font-semibold tracking-[0.14em] uppercase ${colour} ${className}`}
    >
      {children}
    </p>
  );
}

/* -------------------------------------------------------------------------- */
/* Panels                                                                     */
/* -------------------------------------------------------------------------- */

export function Panel({
  children,
  className = "",
  as: Tag = "section",
  accent,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** A 2px status rail along the top edge, e.g. "bg-gold-500". */
  accent?: string;
} & Omit<ComponentProps<"section">, "className" | "children">) {
  return (
    <Tag
      className={`overflow-hidden rounded-xl border border-line bg-surface shadow-panel ${className}`}
      {...rest}
    >
      {accent && <div className={`h-1 w-full ${accent}`} aria-hidden />}
      {children}
    </Tag>
  );
}

export function PanelHeader({
  title,
  eyebrow,
  description,
  action,
  id,
}: {
  title: ReactNode;
  eyebrow?: string;
  description?: ReactNode;
  action?: ReactNode;
  id?: string;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-4 py-3.5 lg:px-5">
      <div className="min-w-0">
        {eyebrow && <Eyebrow className="mb-1.5">{eyebrow}</Eyebrow>}
        <h2 id={id} className="text-sm leading-tight font-semibold text-ink-900">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-xs leading-snug text-ink-500">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function PanelBody({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`p-4 lg:p-5 ${className}`}>{children}</div>;
}

/* -------------------------------------------------------------------------- */
/* Buttons                                                                    */
/* -------------------------------------------------------------------------- */

type Variant = "primary" | "secondary" | "ghost" | "gold" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANT: Record<Variant, string> = {
  primary:
    "bg-navy-800 text-white hover:bg-navy-700 active:bg-navy-900 border border-navy-800",
  secondary:
    "bg-surface text-ink-700 border border-line hover:border-line-strong hover:bg-canvas",
  ghost: "bg-transparent text-ink-500 border border-transparent hover:bg-canvas hover:text-ink-900",
  gold: "bg-gold-500 text-navy-900 hover:bg-gold-400 active:bg-gold-600 border border-gold-500",
  danger: "bg-rose-600 text-white hover:bg-rose-700 border border-rose-600",
};

const SIZE: Record<Size, string> = {
  sm: "min-h-9 px-3 text-xs gap-1.5",
  md: "min-h-11 px-4 text-sm gap-2",
  lg: "min-h-12 px-5 text-sm gap-2",
};

function buttonClass(variant: Variant, size: Size, full?: boolean) {
  return [
    "inline-flex items-center justify-center rounded-lg font-semibold transition-colors",
    "disabled:cursor-not-allowed disabled:opacity-45",
    VARIANT[variant],
    SIZE[size],
    full ? "w-full" : "",
  ].join(" ");
}

export function Button({
  variant = "secondary",
  size = "md",
  full,
  className = "",
  ...rest
}: {
  variant?: Variant;
  size?: Size;
  full?: boolean;
} & ComponentProps<"button">) {
  return (
    <button
      {...rest}
      className={`${buttonClass(variant, size, full)} ${className}`}
    />
  );
}

export function ButtonLink({
  variant = "secondary",
  size = "md",
  full,
  className = "",
  ...rest
}: {
  variant?: Variant;
  size?: Size;
  full?: boolean;
} & ComponentProps<typeof Link>) {
  return (
    <Link {...rest} className={`${buttonClass(variant, size, full)} ${className}`} />
  );
}

/* -------------------------------------------------------------------------- */
/* Status                                                                     */
/* -------------------------------------------------------------------------- */

export type BadgeTone =
  | "neutral"
  | "navy"
  | "gold"
  | "positive"
  | "warning"
  | "critical"
  | "info";

const BADGE: Record<BadgeTone, string> = {
  neutral: "bg-canvas text-ink-500 ring-line",
  navy: "bg-navy-800 text-white ring-navy-800",
  gold: "bg-gold-50 text-gold-600 ring-gold-100",
  positive: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  warning: "bg-amber-50 text-amber-700 ring-amber-100",
  critical: "bg-rose-50 text-rose-700 ring-rose-100",
  info: "bg-sky-50 text-sky-700 ring-sky-100",
};

export function Badge({
  children,
  tone = "neutral",
  dot,
  className = "",
}: {
  children: ReactNode;
  tone?: BadgeTone;
  /** A leading status dot, e.g. "bg-emerald-500". */
  dot?: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] leading-none font-semibold ring-1 ring-inset ${BADGE[tone]} ${className}`}
    >
      {dot && <span className={`size-1.5 rounded-full ${dot}`} aria-hidden />}
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Metrics                                                                    */
/* -------------------------------------------------------------------------- */

export function Metric({
  label,
  value,
  suffix,
  hint,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  suffix?: ReactNode;
  hint?: ReactNode;
  tone?: "default" | "positive" | "warning" | "critical";
}) {
  const colour = {
    default: "text-ink-900",
    positive: "text-emerald-600",
    warning: "text-amber-600",
    critical: "text-rose-600",
  }[tone];

  return (
    <div className="min-w-0">
      <dt className="truncate text-[10px] font-semibold tracking-[0.14em] text-ink-400 uppercase">
        {label}
      </dt>
      <dd
        className={`mt-1.5 flex items-baseline gap-1 text-2xl leading-none font-semibold tracking-tight tnum ${colour}`}
      >
        {value}
        {suffix && (
          <span className="text-sm font-medium text-ink-400">{suffix}</span>
        )}
      </dd>
      {hint && <p className="mt-1.5 text-xs text-ink-500">{hint}</p>}
    </div>
  );
}

/** A row of metrics divided by hairlines, the way a console reports numbers. */
export function MetricRow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <dl
      className={`grid divide-line sm:divide-x [&>*]:px-4 [&>*]:py-4 first:[&>*]:pl-4 ${className}`}
    >
      {children}
    </dl>
  );
}

/* -------------------------------------------------------------------------- */
/* Misc                                                                       */
/* -------------------------------------------------------------------------- */

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-line-strong bg-surface px-6 py-14 text-center">
      <p className="text-sm font-semibold text-ink-900">{title}</p>
      {description && (
        <p className="mx-auto mt-1.5 max-w-sm text-sm text-ink-500">{description}</p>
      )}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}

/** Section heading used between panels on a page. */
export function SectionHeading({
  title,
  meta,
  action,
  id,
}: {
  title: string;
  meta?: ReactNode;
  action?: ReactNode;
  id?: string;
}) {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-baseline gap-3">
        <h2 id={id} className="text-base font-semibold tracking-tight text-ink-900">
          {title}
        </h2>
        {meta && <span className="text-xs font-medium text-ink-500">{meta}</span>}
      </div>
      {action}
    </div>
  );
}

export const inputClass =
  "min-h-11 w-full rounded-lg border border-line bg-surface px-3.5 text-sm text-ink-900 placeholder:text-ink-400 transition-colors hover:border-line-strong focus:border-navy-600 focus:outline-none";
