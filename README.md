# Mise · Staff role

Mobile-first, responsive UI for the **Staff** role of Mise, a hotel-operations
app for floor teams. Built around one persona working one shift: Maya Fernando,
Room Attendant, Housekeeping, Aurora Grand Colombo, Sunday 07:00–15:30.

## Information architecture

Five primary sections, plus screens reached from inside those flows.

| Section | Route | What it holds |
|---|---|---|
| **Today** | `/` | Greeting, next timed task with a live progress ring and countdown, shift-rhythm timeline, supervisor presence and chat |
| **My shift** | `/shift` | Live task card, shift at a glance, the full chronological duty plan, supervisor note, handover link |
| **SOPs** | `/library` | Searchable standards library, filtered by job role or hashtag |
| **Courses** | `/courses` | Operating briefs — PDF, video and deck per brief, with an inline readiness check |
| **Service record** | `/progress` | Five-star ready score, live four-phase breakdown, supervisor comments, verified credentials |

The Courses section carries its own sub-navigation:

| | Route | |
|---|---|---|
| **Paths** | `/paths` | Locked, sequential curriculum unlocked step by step by supervisor sign-off |
| **Forums** | `/forums` | Per-SOP Q&A between staff and supervisors |
| **Feedback** | `/feedback` | Rate a brief and route a suggestion back to its author |
| **Notifications** | `/notifications` | Assignments, supervisor feedback and reminders across in-platform, email and WhatsApp |

Two staff flows sit outside the main navigation:

- **Shift handover** (`/handover`) — unfinished work, guest promises and blocked
  rooms, gated behind a pre-send checklist.
- **Service recovery** (`/service-recovery`) — the guided Listen → Acknowledge →
  Resolve → Follow up workflow, with the staff member's spend authorisation
  limit and a shared incident timeline.

## The SOP / task engine

Every standard (for example `HSK-101` Guest Room Reset & Release) carries a
target time, a fixed set of steps, and four phases: **Prepare, Perform, Verify,
Release**.

- `/sop/[id]` reviews the standard — every phase, why-it-matters callouts, demo
  clips, photo-evidence markers, and the questions others asked about it.
- `/sop/[id]/practice` is the live task runner: countdown against the target
  time, phase-by-phase checklist with running progress, demo clips inline,
  photo capture (`accept="image/*" capture="environment"`), and a line to the
  on-shift supervisor.

A step marked for photo evidence **cannot be ticked until the photo is
captured** — quality proof is a gate, not a suggestion.

## Role switching

The sidebar's top-left control is the Staff/Manager/Author switch. Only the
Staff role is built here; the other two are listed and visibly locked rather
than hidden, so the control reads honestly.

## Responsive behaviour

| Breakpoint | Layout | Navigation |
|---|---|---|
| Mobile (< 640 px) | 1-column card stack | Fixed bottom bar, condensed top identity header |
| Tablet (640–1024 px) | 2-column grid | Fixed bottom bar |
| Desktop (> 1024 px) | 3-column grid, `max-w-6xl` content | Persistent left sidebar |

Every interactive element is at least **56 × 56 px**, verified in-browser at all
three breakpoints. No page scrolls horizontally; the filter rails and Courses
sub-nav scroll inside their own containers.

## Status colours

| Colour | Class | Meaning |
|---|---|---|
| 🔴 Red | `bg-rose-500` | Due next |
| 🟡 Amber | `bg-amber-500` | In progress |
| 🟢 Green | `bg-emerald-500` | Released / verified |
| 🔵 Blue | `bg-sky-500` | Scheduled |

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. There is no login — the app opens on Today, and
the persona is selected by the role switcher, matching the real product.

## Structure

```
app/
  page.tsx                    Today
  shift/page.tsx              My shift
  library/page.tsx            SOPs
  sop/[id]/page.tsx           Standard detail
  sop/[id]/practice/page.tsx  Live task runner
  courses/page.tsx            Operating briefs + readiness checks
  paths/ forums/ feedback/ notifications/
  progress/page.tsx           Service record
  handover/ service-recovery/
components/
  AppShell.tsx        Sidebar, mobile header, bottom bar
  RoleSwitcher.tsx    Staff / Manager / Author
  ShiftTaskCard.tsx   One timed room task
  ProgressRing.tsx    Live progress and score rings
  Countdown.tsx       Ticking clock against a target time
  ReadinessCheck.tsx  Inline multiple-choice check
  FlagChips.tsx       VIP, family arrival, do-not-enter, …
  SubNav.tsx  PageHeader.tsx
lib/
  types.ts  data.ts  store.tsx  nav.ts  ui.ts
```

## Notes

- **No backend.** Checklist ticks, photo captures, readiness passes, read
  notifications, handover and recovery state persist to `localStorage` through
  `useSyncExternalStore`, so server and client renders agree. Replacing
  `lib/store.tsx` with a real API is the only change needed.
- **Countdowns start on mount**, seeded from a fixed value, so the first paint
  is deterministic and hydration never mismatches.
- **Light theme only**, deliberately: this is used on the floor in daylight.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · lucide-react.
Vercel-standard layout; `npm run build` and `npm run lint` are clean.

---

# Intern onboarding module

A second, unrelated app living in the same repo under `/onboarding`: the
internal flow that takes a selected Focus Realm intern from offer to first day.
It has its own navy-and-gold chrome and does not appear anywhere in the
hospitality product above.

## The flow

| | Candidate | Founders |
|---|---|---|
| 1 | Submits full name, parent's name, address, Aadhaar number and a copy of the card | |
| 2 | Reads both handbooks, watches both video briefings | |
| 3 | Passes both assessments — **75% each, judged separately**, unlimited retakes | |
| 4 | Reviews the agreement, generated from their own details, and e-signs it | |
| 5 | | Verifies the signature, or sends it back with a note |
| 6 | Requests a mailbox | Creates it on SpaceMail, records the address and password |
| 7 | Collects the password **once**, with IMAP/SMTP settings and Outlook steps | |

Stages are derived from the record itself (`lib/onboarding/stage.ts`), so a
candidate can never be in a state their data does not support. Each step is
enforced server-side, not just hidden in the UI.

## Routes

```
/onboarding                     Landing — paste your invite link
/onboarding/[token]             The candidate's whole onboarding
/onboarding/admin               Founders' console (passcode)
/onboarding/admin/[id]          One candidate: documents and decisions
/api/onboarding/…               Everything above talks to these
```

## Setup

```bash
cp .env.example .env.local     # then fill both values in
npm run dev
```

Open `/onboarding/admin`, create a candidate, and send them the generated link.

## Handling of personal data

- **Aadhaar uploads never enter `public/`.** They go to a private Supabase
  bucket under a random filename, and stream only through an
  admin-authenticated route.
- **The Aadhaar number is masked everywhere but the founders' console** —
  including in the candidate's own view and on the rendered agreement.
- **Temporary mailbox passwords are encrypted at rest** (AES-256-GCM) and
  destroyed after a single view.
- **Assessment answer keys stay server-side** (`tests.server.ts`); submissions
  are scored on the server, so the 75% gate cannot be bypassed from the browser.
- The onboarding link is a bearer credential. Anyone holding it can act as that
  candidate, so treat it like a password.

Before real candidate data goes in, confirm: which Supabase region the project
sits in (Aadhaar data of Indian residents is worth keeping in `ap-south-1`),
who holds the service-role key, how long records are kept, and legal review of
the agreement template.

## Storage

Supabase, reached only from `lib/onboarding/store.server.ts`:

| | |
|---|---|
| `public.onboarding_candidates` | One row per candidate — the record as `jsonb`, plus indexed `id`/`token`/`created_at` and a `version` for optimistic concurrency |
| `onboarding-aadhaar` bucket | The uploaded Aadhaar copies, private |

Both have **RLS enabled with no policies at all**, so the anon key cannot touch
either one. The service-role key is the only way in, and it is used
server-side only. Concurrent writes retry against fresh state rather than
overwriting, so quick successive actions can't clobber each other.

## Deploying to Vercel

1. Import the repo — Next.js is detected, no build settings needed.
2. Set all four variables from `.env.example` in **Settings → Environment
   Variables**. `SUPABASE_SERVICE_ROLE_KEY` must be server-side only: do not
   give it a `NEXT_PUBLIC_` prefix.
3. Deploy.

`next.config.ts` carries an `outputFileTracingIncludes` entry for the handbook
route — the PDFs are read from a path built at runtime, which the file tracer
cannot follow on its own. Without it the handbooks 500 in production.

## Content

Handbooks and the agreement template live in `content/onboarding/` and are the
source of truth. Assessment questions are in `lib/onboarding/tests.server.ts`,
twelve per handbook, each traceable to a section. Video links and SpaceMail
settings are in `lib/onboarding/content.ts`.
