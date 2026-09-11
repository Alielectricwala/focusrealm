interface Props {
  /** 0–100. */
  percent: number;
  size?: number;
  stroke?: number;
  label?: string;
  sublabel?: string;
  className?: string;
}

/** Circular progress used for the live task and the five-star score. */
export default function ProgressRing({
  percent,
  size = 84,
  stroke = 6,
  label,
  sublabel,
  className = "text-gold-500",
}: Props) {
  const clamped = Math.max(0, Math.min(100, percent));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${Math.round(clamped)} percent${label ? ` — ${label}` : ""}`}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-line"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${className} stroke-current transition-[stroke-dashoffset] duration-500`}
        />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg leading-none font-semibold tracking-tight text-ink-900 tnum">
          {Math.round(clamped)}
          <span className="text-xs font-medium text-ink-400">%</span>
        </span>
        {sublabel && (
          <span className="mt-1 text-[9px] leading-none font-semibold tracking-[0.14em] text-ink-400 uppercase">
            {sublabel}
          </span>
        )}
      </span>
    </div>
  );
}
