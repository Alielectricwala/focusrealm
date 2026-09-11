import { FLAG } from "@/lib/ui";
import type { TaskFlag } from "@/lib/types";

export default function FlagChips({
  flags,
  size = "sm",
}: {
  flags: TaskFlag[];
  size?: "sm" | "md";
}) {
  if (flags.length === 0) return null;

  return (
    <ul className="flex flex-wrap items-center gap-1.5">
      {flags.map((flag) => (
        <li
          key={flag}
          className={`rounded-md font-semibold ring-1 ring-inset ${FLAG[flag].className} ${
            size === "md" ? "px-2 py-1 text-[11px]" : "px-1.5 py-0.5 text-[10px]"
          }`}
        >
          {FLAG[flag].label}
        </li>
      ))}
    </ul>
  );
}
