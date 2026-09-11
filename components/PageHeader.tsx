import { Eyebrow } from "./ui/kit";

/** The title block every console screen opens with. */
export default function PageHeader({
  title,
  subtitle,
  eyebrow,
  action,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-line pb-4">
      <div className="min-w-0">
        {eyebrow && <Eyebrow className="mb-2">{eyebrow}</Eyebrow>}
        <h1 className="text-xl leading-tight font-semibold tracking-tight text-ink-900 lg:text-2xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1.5 text-sm leading-snug text-ink-500">{subtitle}</p>
        )}
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>
  );
}
