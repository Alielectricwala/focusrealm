"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button, Card, Notice, SectionTitle, Wordmark, inputClass, inputStyle } from "@/components/onboarding/ui";

const STEPS = [
  "Submit your details and a copy of your Aadhaar card",
  "Read both handbooks and watch both video briefings",
  "Pass both assessments — 75% on each",
  "Review and sign your internship agreement",
  "We verify the signed agreement",
  "Request your Focus Realm email and set it up",
];

/** Landing page for candidates who have the link but not the full URL. */
export default function OnboardingLanding() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  function open() {
    // Accept either the whole invite URL or just the code at the end of it.
    const token = value.trim().replace(/\/+$/, "").split("/").pop();
    if (!token) {
      setMessage("Paste the link from your invitation.");
      return;
    }
    router.push(`/onboarding/${token}`);
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 lg:py-16">
      <div className="mb-10">
        <Wordmark subtitle="Intern onboarding" />
      </div>

      <Card className="mb-5">
        <SectionTitle
          eyebrow="Internal"
          title="Focus Realm intern onboarding"
          lead="Everything between being offered a place and your first working day, in one link. It takes most people an afternoon."
        />

        <ol className="mb-6 space-y-2.5">
          {STEPS.map((step, index) => (
            <li key={step} className="flex items-start gap-3">
              <span
                className="flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-black"
                style={{ backgroundColor: "rgba(201,162,39,0.16)", color: "var(--fr-gold-soft)" }}
                aria-hidden
              >
                {index + 1}
              </span>
              <span className="text-sm leading-snug text-pretty">{step}</span>
            </li>
          ))}
        </ol>

        <div className="space-y-3">
          <label className="block">
            <span className="mb-2 block text-sm font-bold">Open your onboarding</span>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && open()}
              placeholder="Paste the link from your invitation"
              className={inputClass}
              style={inputStyle}
            />
          </label>

          {message && <Notice tone="bad">{message}</Notice>}

          <Button onClick={open}>
            Continue
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </div>
      </Card>

      <p className="text-center text-xs" style={{ color: "var(--fr-muted)" }}>
        Founders —{" "}
        <Link href="/onboarding/admin" className="font-bold underline">
          open the console
        </Link>
      </p>
    </div>
  );
}
