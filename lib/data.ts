import type {
  Course,
  ForumThread,
  Handover,
  JobRole,
  LearningPath,
  ServiceRecord,
  ServiceRecovery,
  ShiftCheckpoint,
  ShiftGlance,
  ShiftTask,
  Sop,
  StaffNotification,
  StaffProfile,
  Supervisor,
} from "./types";

export const STAFF: StaffProfile = {
  name: "Maya Fernando",
  title: "Room Attendant",
  jobRole: "room-attendant",
  department: "Housekeeping",
  property: "Aurora Grand Colombo",
  shiftLabel: "07:00 – 15:30",
  shiftDay: "Sunday",
  initials: "MF",
};

export const SUPERVISOR: Supervisor = {
  name: "Nirosha Perera",
  title: "Floor Supervisor",
  initials: "NP",
  onShift: true,
};

export const JOB_ROLE_LABEL: Record<JobRole, string> = {
  "room-attendant": "Room attendant",
  "front-office": "Front office",
  "food-beverage": "F&B",
  engineering: "Engineering",
  security: "Security",
};

/* -------------------------------------------------------------------------- */
/* Standards library                                                          */
/* -------------------------------------------------------------------------- */

export const SOPS: Sop[] = [
  {
    id: "hsk-101",
    code: "HSK-101",
    title: "Guest Room Reset & Release",
    jobRole: "room-attendant",
    hashtags: ["#room-release", "#bathroom", "#linen"],
    readMinutes: 6,
    targetMinutes: 28,
    summary:
      "The full checkout reset, from trolley staging to releasing the room back to Front Office.",
    qualityScore: 96,
    usageCount: 1284,
    phases: [
      {
        key: "prepare",
        steps: [
          {
            id: "hsk-101-p1",
            text: "Check the arrival board for the room's next guest and arrival time.",
            why: "An arrival before 14:00 changes the order you work the floor.",
          },
          {
            id: "hsk-101-p2",
            text: "Stage the trolley: linen, amenities, chemicals, cloths by colour.",
            clip: "Trolley staging · 40s",
          },
          {
            id: "hsk-101-p3",
            text: 'Knock twice, announce "Housekeeping", wait ten seconds before entering.',
            why: "A guest still in the room is the most common complaint on this floor.",
          },
        ],
      },
      {
        key: "perform",
        steps: [
          {
            id: "hsk-101-a1",
            text: "Strip all linen and bag it before touching anything else.",
            why: "Stripping last spreads soil onto surfaces you have already cleaned.",
            clip: "Strip and bag · 55s",
          },
          {
            id: "hsk-101-a2",
            text: "Clear waste, then service the bathroom top to bottom.",
          },
          {
            id: "hsk-101-a3",
            text: "Dust high to low, then vacuum backwards out of the room.",
          },
          {
            id: "hsk-101-a4",
            text: "Make the bed to the Aurora standard: 15cm turn, crest centred.",
            clip: "Bed finish · 1m 10s",
          },
          {
            id: "hsk-101-a5",
            text: "Replenish amenities to the standard tray layout.",
          },
        ],
      },
      {
        key: "verify",
        steps: [
          {
            id: "hsk-101-v1",
            text: "Smell check from the doorway — the room must read neutral, not perfumed.",
            why: "Fragrance masks damp. Damp is what the guest reports.",
          },
          {
            id: "hsk-101-v2",
            text: "Mirror, glass and chrome checked under the room light.",
            photo: true,
          },
          {
            id: "hsk-101-v3",
            text: "Remote, phone, handles and switches sanitised.",
          },
        ],
      },
      {
        key: "release",
        steps: [
          {
            id: "hsk-101-r1",
            text: "Set climate to 23°C and draw the curtains to half.",
          },
          {
            id: "hsk-101-r2",
            text: "Mark the room Released on the board.",
            why: "Front Office cannot allocate the room until you release it.",
          },
          {
            id: "hsk-101-r3",
            text: "Log any fault to Engineering before you leave the floor.",
          },
        ],
      },
    ],
  },
  {
    id: "hsk-104",
    code: "HSK-104",
    title: "Bathroom Deep Clean",
    jobRole: "room-attendant",
    hashtags: ["#bathroom", "#room-release"],
    readMinutes: 5,
    targetMinutes: 18,
    summary:
      "The weekly deep clean that sits behind the daily bathroom service, including descaling and grout.",
    qualityScore: 93,
    usageCount: 742,
    phases: [
      {
        key: "prepare",
        steps: [
          {
            id: "hsk-104-p1",
            text: "Ventilate the room and set out the descaler dwell timer.",
          },
          {
            id: "hsk-104-p2",
            text: "Colour-code cloths: red for sanitary, blue for glass.",
            why: "Cross-use of cloths is the single biggest audit failure.",
          },
        ],
      },
      {
        key: "perform",
        steps: [
          {
            id: "hsk-104-a1",
            text: "Apply descaler to the rain head and let it dwell five minutes.",
            clip: "Descaling · 45s",
          },
          {
            id: "hsk-104-a2",
            text: "Work grout lines with the detail brush, corner to corner.",
          },
          {
            id: "hsk-104-a3",
            text: "Polish glass with the squeegee in a single top-down pass.",
          },
        ],
      },
      {
        key: "verify",
        steps: [
          {
            id: "hsk-104-v1",
            text: "Run a hand over the glass — it must squeak, not drag.",
          },
          {
            id: "hsk-104-v2",
            text: "Photograph the shower enclosure under full light.",
            photo: true,
          },
        ],
      },
      {
        key: "release",
        steps: [
          {
            id: "hsk-104-r1",
            text: "Reset amenities and fold the towel presentation.",
          },
          {
            id: "hsk-104-r2",
            text: "Record the deep clean date on the room card.",
          },
        ],
      },
    ],
  },
  {
    id: "hsk-108",
    code: "HSK-108",
    title: "Linen Handling & Change",
    jobRole: "room-attendant",
    hashtags: ["#linen"],
    readMinutes: 4,
    targetMinutes: 12,
    summary:
      "How linen moves from trolley to bed to chute without breaking the clean-soil separation.",
    qualityScore: 91,
    usageCount: 968,
    phases: [
      {
        key: "prepare",
        steps: [
          {
            id: "hsk-108-p1",
            text: "Count linen against the room type before entering.",
          },
          {
            id: "hsk-108-p2",
            text: "Keep the soil bag on the corridor side of the trolley.",
            why: "Clean and soil must never cross over the same edge.",
          },
        ],
      },
      {
        key: "perform",
        steps: [
          {
            id: "hsk-108-a1",
            text: "Strip from the head of the bed, rolling inward.",
            clip: "Roll and lift · 35s",
          },
          {
            id: "hsk-108-a2",
            text: "Inspect every sheet for stains and tears as you strip.",
          },
          {
            id: "hsk-108-a3",
            text: "Dress the bed with mitred corners on all four sides.",
          },
        ],
      },
      {
        key: "verify",
        steps: [
          {
            id: "hsk-108-v1",
            text: "Check the turn is even across the width of the bed.",
          },
        ],
      },
      {
        key: "release",
        steps: [
          {
            id: "hsk-108-r1",
            text: "Send flagged linen to the reject bin, not the chute.",
          },
        ],
      },
    ],
  },
  {
    id: "hsk-112",
    code: "HSK-112",
    title: "Turndown Service",
    jobRole: "room-attendant",
    hashtags: ["#turndown"],
    readMinutes: 4,
    targetMinutes: 9,
    summary:
      "The evening service that sets the room for sleep, including the Aurora bedside ritual.",
    qualityScore: 89,
    usageCount: 431,
    phases: [
      {
        key: "prepare",
        steps: [
          {
            id: "hsk-112-p1",
            text: "Check the DND board before starting the floor.",
          },
        ],
      },
      {
        key: "perform",
        steps: [
          {
            id: "hsk-112-a1",
            text: "Turn the cover down at a 45° angle on the occupied side.",
            clip: "Turndown fold · 30s",
          },
          {
            id: "hsk-112-a2",
            text: "Set slippers, water and the weather card at the bedside.",
          },
          {
            id: "hsk-112-a3",
            text: "Draw curtains fully and set the bedside lamp only.",
          },
        ],
      },
      {
        key: "verify",
        steps: [
          {
            id: "hsk-112-v1",
            text: "Stand at the door — the room should read calm, not staged.",
          },
        ],
      },
      {
        key: "release",
        steps: [
          {
            id: "hsk-112-r1",
            text: "Log the turndown and any guest items noticed.",
          },
        ],
      },
    ],
  },
  {
    id: "hsk-115",
    code: "HSK-115",
    title: "Minibar Replenishment",
    jobRole: "room-attendant",
    hashtags: ["#minibar"],
    readMinutes: 3,
    targetMinutes: 7,
    summary:
      "Checking, charging and restocking the minibar without disputes at checkout.",
    qualityScore: 87,
    usageCount: 388,
    phases: [
      {
        key: "prepare",
        steps: [
          {
            id: "hsk-115-p1",
            text: "Open the consumption screen before you open the fridge.",
          },
        ],
      },
      {
        key: "perform",
        steps: [
          {
            id: "hsk-115-a1",
            text: "Record consumption item by item, out loud, as you remove.",
            why: "Post-hoc counting is where billing disputes start.",
          },
          {
            id: "hsk-115-a2",
            text: "Restock to the planogram, labels facing out.",
          },
        ],
      },
      {
        key: "verify",
        steps: [
          {
            id: "hsk-115-v1",
            text: "Check every expiry date on the front row.",
          },
        ],
      },
      {
        key: "release",
        steps: [
          {
            id: "hsk-115-r1",
            text: "Post charges before leaving the room.",
          },
        ],
      },
    ],
  },
  {
    id: "fo-201",
    code: "FO-201",
    title: "Guest Arrival & Check-In",
    jobRole: "front-office",
    hashtags: ["#arrival"],
    readMinutes: 5,
    targetMinutes: 6,
    summary:
      "The arrival sequence from doorway greeting to key handover and room orientation.",
    qualityScore: 94,
    usageCount: 1502,
    phases: [
      {
        key: "prepare",
        steps: [
          { id: "fo-201-p1", text: "Pre-read the arrival profile and any notes." },
        ],
      },
      {
        key: "perform",
        steps: [
          {
            id: "fo-201-a1",
            text: "Greet within ten seconds of the guest reaching the desk.",
          },
          { id: "fo-201-a2", text: "Confirm booking name and photo ID." },
          {
            id: "fo-201-a3",
            text: "Explain breakfast and Wi-Fi in one sentence each.",
          },
        ],
      },
      {
        key: "verify",
        steps: [
          { id: "fo-201-v1", text: "Confirm the guest can repeat the room number." },
        ],
      },
      {
        key: "release",
        steps: [
          { id: "fo-201-r1", text: "Offer luggage assistance before they walk away." },
        ],
      },
    ],
  },
  {
    id: "fb-301",
    code: "FB-301",
    title: "Breakfast Service Reset",
    jobRole: "food-beverage",
    hashtags: ["#service"],
    readMinutes: 4,
    targetMinutes: 22,
    summary:
      "Resetting the buffet line between covers, including allergen card discipline.",
    qualityScore: 90,
    usageCount: 655,
    phases: [
      {
        key: "prepare",
        steps: [{ id: "fb-301-p1", text: "Check hot holding is above 60°C." }],
      },
      {
        key: "perform",
        steps: [
          { id: "fb-301-a1", text: "Rotate depleted dishes front to back." },
          { id: "fb-301-a2", text: "Reset allergen cards to match the new dish." },
        ],
      },
      {
        key: "verify",
        steps: [{ id: "fb-301-v1", text: "Walk the line from the guest's side." }],
      },
      {
        key: "release",
        steps: [{ id: "fb-301-r1", text: "Log temperatures in the kitchen record." }],
      },
    ],
  },
  {
    id: "eng-401",
    code: "ENG-401",
    title: "Guest Room Fault Triage",
    jobRole: "engineering",
    hashtags: ["#maintenance"],
    readMinutes: 5,
    targetMinutes: 15,
    summary:
      "Triaging a reported room fault into fix-now, fix-today, or room-out-of-order.",
    qualityScore: 92,
    usageCount: 274,
    phases: [
      {
        key: "prepare",
        steps: [{ id: "eng-401-p1", text: "Confirm the room is unoccupied." }],
      },
      {
        key: "perform",
        steps: [
          { id: "eng-401-a1", text: "Reproduce the fault before opening anything." },
          { id: "eng-401-a2", text: "Classify: fix now, fix today, or take out of order." },
        ],
      },
      {
        key: "verify",
        steps: [{ id: "eng-401-v1", text: "Test twice after the fix." }],
      },
      {
        key: "release",
        steps: [{ id: "eng-401-r1", text: "Return the room status to Housekeeping." }],
      },
    ],
  },
  {
    id: "sec-501",
    code: "SEC-501",
    title: "Floor Security Walk",
    jobRole: "security",
    hashtags: ["#security"],
    readMinutes: 3,
    targetMinutes: 12,
    summary:
      "The hourly floor walk covering fire doors, exits and unattended items.",
    qualityScore: 95,
    usageCount: 1120,
    phases: [
      {
        key: "prepare",
        steps: [{ id: "sec-501-p1", text: "Take the floor key and the walk sheet." }],
      },
      {
        key: "perform",
        steps: [
          { id: "sec-501-a1", text: "Check every fire door closes fully." },
          { id: "sec-501-a2", text: "Clear and log unattended items." },
        ],
      },
      {
        key: "verify",
        steps: [{ id: "sec-501-v1", text: "Confirm exit signage is lit end to end." }],
      },
      {
        key: "release",
        steps: [{ id: "sec-501-r1", text: "Sign the walk sheet at the floor station." }],
      },
    ],
  },
];

export const HASHTAGS = [
  "#room-release",
  "#bathroom",
  "#linen",
  "#turndown",
  "#minibar",
  "#arrival",
  "#service",
  "#maintenance",
  "#security",
];

/* -------------------------------------------------------------------------- */
/* The shift                                                                  */
/* -------------------------------------------------------------------------- */

export const SHIFT_TASKS: ShiftTask[] = [
  {
    id: "t-402",
    room: "402",
    sopId: "hsk-101",
    dueAt: "08:30",
    status: "complete",
    flags: [],
    fiveStarCue: "Angle the armchair toward the window before you leave.",
  },
  {
    id: "t-406",
    room: "406",
    sopId: "hsk-101",
    dueAt: "08:55",
    status: "complete",
    flags: ["early-arrival"],
    fiveStarCue: "Leave the desk lamp on for an early arrival.",
  },
  {
    id: "t-412",
    room: "412",
    sopId: "hsk-101",
    dueAt: "09:15",
    status: "active",
    flags: ["vip"],
    fiveStarCue:
      "This guest asked for extra pillows last stay — set them before they ask again.",
    remainingSeconds: 11 * 60 + 40,
    percent: 62,
  },
  {
    id: "t-415",
    room: "415",
    sopId: "hsk-101",
    dueAt: "10:00",
    status: "urgent",
    flags: ["family-arrival"],
    fiveStarCue: "Family arrival — clear the minibar glassware to the top shelf.",
  },
  {
    id: "t-418",
    room: "418",
    sopId: "hsk-104",
    dueAt: "10:45",
    status: "scheduled",
    flags: ["do-not-enter"],
    fiveStarCue: "Do not enter until the board clears. Work 421 first if it holds.",
  },
  {
    id: "t-421",
    room: "421",
    sopId: "hsk-101",
    dueAt: "11:30",
    status: "scheduled",
    flags: ["late-arrival"],
    fiveStarCue: "Late arrival at 22:00 — set turndown items out early.",
  },
  {
    id: "t-427",
    room: "427",
    sopId: "hsk-108",
    dueAt: "13:15",
    status: "scheduled",
    flags: ["allergy"],
    fiveStarCue: "Feather allergy on file — confirm the pillow swap on the card.",
  },
  {
    id: "t-430",
    room: "430",
    sopId: "hsk-101",
    dueAt: "14:00",
    status: "scheduled",
    flags: ["vip", "late-arrival"],
    fiveStarCue: "Suite guest returning — match the amenity layout from their last stay.",
  },
];

export const SHIFT_RHYTHM: ShiftCheckpoint[] = [
  {
    id: "c-brief",
    at: "07:00",
    label: "Shift brief",
    detail: "Floor allocation and arrival pressure with Nirosha.",
    status: "complete",
  },
  {
    id: "c-reset",
    at: "09:15",
    label: "Room reset",
    detail: "Room 412 · Guest Room Reset & Release.",
    status: "active",
  },
  {
    id: "c-verify",
    at: "12:00",
    label: "Quality verification",
    detail: "Supervisor spot-check on two released rooms.",
    status: "scheduled",
  },
];

export const SHIFT_GLANCE: ShiftGlance = {
  roomsReleased: 2,
  roomsTotal: 8,
  onTimePace: 94,
  arrivalPressure: "6 arrivals before 15:00",
};

export const SUPERVISOR_NOTE =
  "Floor 4 has two VIP returns today. Release 412 and 430 early if you can — Front Office wants both ready before the 14:00 wave.";

/* -------------------------------------------------------------------------- */
/* Courses, paths, forums, notifications                                      */
/* -------------------------------------------------------------------------- */

export const COURSES: Course[] = [
  {
    id: "brief-reset",
    title: "Room Reset Operating Brief",
    sopId: "hsk-101",
    summary:
      "Everything behind HSK-101: the order of work, the finish standard, and the three checks that fail audits.",
    assets: [
      { kind: "pdf", label: "Reset guide", meta: "PDF · 8 pages" },
      { kind: "video", label: "Full room walkthrough", meta: "Video · 6 min" },
      { kind: "deck", label: "Finish standards", meta: "Deck · 14 slides" },
    ],
    readinessCheck: [
      {
        id: "brief-reset-q1",
        prompt: "When do you strip the linen on a checkout room?",
        options: [
          { id: "a", label: "First, before anything else", correct: true },
          { id: "b", label: "After the bathroom is serviced" },
          { id: "c", label: "Last, once the room is dusted" },
        ],
      },
      {
        id: "brief-reset-q2",
        prompt: "What should the room smell like at the door check?",
        options: [
          { id: "a", label: "Neutral", correct: true },
          { id: "b", label: "Lightly fragranced" },
          { id: "c", label: "Whatever the guest requested" },
        ],
      },
      {
        id: "brief-reset-q3",
        prompt: "Who can allocate the room once you finish?",
        options: [
          { id: "a", label: "Nobody, until you mark it Released", correct: true },
          { id: "b", label: "Front Office, straight away" },
          { id: "c", label: "The supervisor, after the spot-check" },
        ],
      },
    ],
  },
  {
    id: "brief-bathroom",
    title: "Bathroom Standards Brief",
    sopId: "hsk-104",
    summary:
      "Cloth discipline, descaling dwell times, and the glass finish the audit actually measures.",
    assets: [
      { kind: "pdf", label: "Bathroom standard", meta: "PDF · 5 pages" },
      { kind: "video", label: "Descale and polish", meta: "Video · 4 min" },
      { kind: "deck", label: "Cloth colour system", meta: "Deck · 8 slides" },
    ],
    readinessCheck: [
      {
        id: "brief-bathroom-q1",
        prompt: "Which cloth colour is for sanitary areas?",
        options: [
          { id: "a", label: "Red", correct: true },
          { id: "b", label: "Blue" },
          { id: "c", label: "Any, if it is clean" },
        ],
      },
      {
        id: "brief-bathroom-q2",
        prompt: "How long should descaler dwell on the rain head?",
        options: [
          { id: "a", label: "Five minutes", correct: true },
          { id: "b", label: "Thirty seconds" },
          { id: "c", label: "Until it dries" },
        ],
      },
    ],
  },
  {
    id: "brief-linen",
    title: "Linen Handling Brief",
    sopId: "hsk-108",
    summary:
      "Keeping clean and soil apart, and catching damaged linen before it reaches the bed.",
    assets: [
      { kind: "pdf", label: "Linen flow", meta: "PDF · 4 pages" },
      { kind: "video", label: "Strip and dress", meta: "Video · 5 min" },
      { kind: "deck", label: "Reject criteria", meta: "Deck · 6 slides" },
    ],
    readinessCheck: [
      {
        id: "brief-linen-q1",
        prompt: "Where does the soil bag sit on the trolley?",
        options: [
          { id: "a", label: "On the corridor side", correct: true },
          { id: "b", label: "On the room side" },
          { id: "c", label: "Underneath the clean linen" },
        ],
      },
    ],
  },
  {
    id: "brief-turndown",
    title: "Turndown Brief",
    sopId: "hsk-112",
    summary:
      "The evening ritual, the DND rule, and how to read a room you are not allowed to enter.",
    assets: [
      { kind: "pdf", label: "Turndown standard", meta: "PDF · 3 pages" },
      { kind: "video", label: "Bedside ritual", meta: "Video · 3 min" },
      { kind: "deck", label: "Evening sequence", meta: "Deck · 7 slides" },
    ],
    readinessCheck: [
      {
        id: "brief-turndown-q1",
        prompt: "A room shows Do Not Disturb at turndown. What do you do?",
        options: [
          { id: "a", label: "Skip it and log the DND", correct: true },
          { id: "b", label: "Knock anyway" },
          { id: "c", label: "Enter quietly" },
        ],
      },
    ],
  },
];

export const PATH: LearningPath = {
  id: "path-room-attendant",
  title: "Room Attendant Path",
  jobRole: "room-attendant",
  steps: [
    {
      id: "step-reset",
      title: "Guest Room Reset & Release",
      sopId: "hsk-101",
      state: "verified",
      signedOffBy: "Nirosha Perera",
      signedOffAt: "12 Jul",
    },
    {
      id: "step-turndown",
      title: "Turndown Service",
      sopId: "hsk-112",
      state: "active",
    },
    { id: "step-minibar", title: "Minibar Replenishment", sopId: "hsk-115", state: "locked" },
    { id: "step-suite", title: "Suite Arrival Standard", sopId: "hsk-104", state: "locked" },
  ],
};

export const FORUM_THREADS: ForumThread[] = [
  {
    id: "thread-strip-order",
    sopId: "hsk-101",
    question: "On a checkout, do we strip linen before or after clearing waste?",
    posts: [
      {
        id: "p1",
        author: "Maya Fernando",
        role: "Staff",
        initials: "MF",
        body: "The brief says strip first, but on heavy checkouts the waste is in the way of the bed.",
        at: "Yesterday · 14:20",
      },
      {
        id: "p2",
        author: "Nirosha Perera",
        role: "Supervisor",
        initials: "NP",
        body: "Strip first, always. Clear only the waste blocking your path to the bed, then bag the rest after. The rule exists so soil never lands on cleaned surfaces.",
        at: "Yesterday · 15:05",
      },
    ],
  },
  {
    id: "thread-glass",
    sopId: "hsk-104",
    question: "Which chemical for the rain shower glass on floor 4?",
    posts: [
      {
        id: "p3",
        author: "Maya Fernando",
        role: "Staff",
        initials: "MF",
        body: "The descaler leaves a film on the new enclosures in 415 and 418.",
        at: "2 days ago · 09:40",
      },
      {
        id: "p4",
        author: "Nirosha Perera",
        role: "Supervisor",
        initials: "NP",
        body: "New enclosures are coated — descaler only on the head, then squeegee the glass with plain hot water. I have asked the author to add this to HSK-104.",
        at: "2 days ago · 10:12",
      },
    ],
  },
  {
    id: "thread-dnd",
    sopId: "hsk-112",
    question: "Turndown when the guest has DND up all evening?",
    posts: [
      {
        id: "p5",
        author: "Maya Fernando",
        role: "Staff",
        initials: "MF",
        body: "Do I keep checking back, or log it once?",
        at: "4 days ago · 19:15",
      },
      {
        id: "p6",
        author: "Nirosha Perera",
        role: "Supervisor",
        initials: "NP",
        body: "Check back once at 21:00. If DND is still up, log it and leave the bedside card at reception for the morning team.",
        at: "4 days ago · 19:48",
      },
    ],
  },
];

export const NOTIFICATIONS: StaffNotification[] = [
  {
    id: "n1",
    kind: "assignment",
    channels: ["in-app", "whatsapp"],
    title: "New brief assigned: Turndown Brief",
    body: "Complete the readiness check before your next evening shift.",
    at: "Today · 07:05",
    href: "/courses",
  },
  {
    id: "n2",
    kind: "feedback",
    channels: ["in-app"],
    title: "Nirosha commented on your Room 412 verification",
    body: "Bathroom finish was audit-clean. Log the tap drip to Engineering before you leave the floor.",
    at: "Today · 06:52",
    href: "/progress",
  },
  {
    id: "n3",
    kind: "assignment",
    channels: ["in-app"],
    title: "Path step unlocked: Turndown Service",
    body: "Nirosha signed off Guest Room Reset & Release. The next step is open.",
    at: "Yesterday · 16:30",
    href: "/paths",
  },
  {
    id: "n4",
    kind: "reminder",
    channels: ["email"],
    title: "Readiness check due before 15:00",
    body: "Room Reset Operating Brief is still showing incomplete.",
    at: "Yesterday · 12:00",
    href: "/courses",
  },
  {
    id: "n5",
    kind: "reminder",
    channels: ["whatsapp"],
    title: "Shift handover due at 15:15",
    body: "Send your handover before you leave so the evening team can pick up 430.",
    at: "Yesterday · 08:00",
    href: "/handover",
  },
];

/* -------------------------------------------------------------------------- */
/* Service record, handover, recovery                                         */
/* -------------------------------------------------------------------------- */

export const SERVICE_RECORD: ServiceRecord = {
  fiveStarScore: 92,
  verifiedStandards: 6,
  activeStandards: 3,
  strengths: [
    "Bathroom finish is consistently audit-clean across spot-checks.",
    "Arrival-critical rooms are released ahead of the board almost every shift.",
    "Guest preferences from previous stays are picked up without prompting.",
  ],
  improvements: [
    "Log engineering faults before leaving the floor, not at shift end.",
    "Slow down the final smell check on suites — it is being rushed.",
  ],
  credentials: [
    { id: "cr1", title: "Guest Room Reset & Release", code: "HSK-101", verifiedAt: "12 Jul 2026" },
    { id: "cr2", title: "Bathroom Deep Clean", code: "HSK-104", verifiedAt: "28 Jun 2026" },
    { id: "cr3", title: "Linen Handling & Change", code: "HSK-108", verifiedAt: "14 Jun 2026" },
    { id: "cr4", title: "Floor Security Awareness", code: "SEC-501", verifiedAt: "02 Jun 2026" },
    { id: "cr5", title: "Fire Safety Induction", code: "SAF-001", verifiedAt: "19 May 2026" },
    { id: "cr6", title: "Guest Privacy & Data", code: "GOV-011", verifiedAt: "19 May 2026" },
  ],
};

export const HANDOVER: Handover = {
  unfinished: [
    { id: "h1", room: "430", detail: "Reset not started. Suite guest returning at 22:00." },
    { id: "h2", room: "427", detail: "Linen change done, minibar not yet checked." },
  ],
  guestPromises: [
    { id: "h3", room: "412", detail: "Extra pillows promised to the guest by 16:00." },
    { id: "h4", room: "421", detail: "Late checkout confirmed to 14:00 — do not chase." },
  ],
  blockedRooms: [
    { id: "h5", room: "418", detail: "Do Not Enter until the guest departs." },
    { id: "h6", room: "427", detail: "AC fault logged to Engineering at 11:40." },
  ],
  checklist: [
    { id: "hc1", label: "Every unfinished room has a named reason" },
    { id: "hc2", label: "Guest promises carry a time and a room" },
    { id: "hc3", label: "Blocked rooms are logged with Engineering or Front Office" },
    { id: "hc4", label: "Trolley restocked and floor station left clear" },
  ],
};

export const SERVICE_RECOVERY: ServiceRecovery = {
  spendLimit: "15,000",
  currency: "LKR",
  steps: [
    {
      key: "listen",
      title: "Listen",
      prompt: "Let the guest finish before you say anything beyond acknowledgement.",
      actions: [
        "Stop what you are carrying and face the guest",
        "Do not explain or defend while they are still speaking",
        "Repeat the problem back in your own words",
      ],
    },
    {
      key: "acknowledge",
      title: "Acknowledge",
      prompt: "Name the impact on their stay, not the process behind it.",
      actions: [
        'Say what went wrong plainly — "your room was not ready"',
        "Apologise once, clearly, without conditions",
        "Tell them what happens next and when",
      ],
    },
    {
      key: "resolve",
      title: "Resolve",
      prompt: "Fix what you can yourself, inside your authorisation.",
      actions: [
        "Act within your spend limit without asking permission",
        "Escalate to the duty manager above the limit",
        "Give the guest one clear time, not a range",
      ],
    },
    {
      key: "follow-up",
      title: "Follow up",
      prompt: "Close the loop yourself, even after the shift changes.",
      actions: [
        "Check back in person within the hour",
        "Record the outcome on the incident timeline",
        "Hand the open promise to the next shift",
      ],
    },
  ],
  timeline: [
    {
      id: "i1",
      at: "09:42",
      actor: "Front Office",
      detail: "Guest in 415 reported the room was not ready at check-in.",
    },
    {
      id: "i2",
      at: "09:47",
      actor: "Maya Fernando",
      detail: "Met the guest at the room, acknowledged and offered the lounge.",
    },
    {
      id: "i3",
      at: "09:55",
      actor: "Maya Fernando",
      detail: "Authorised welcome amenity within limit. Room promised for 10:20.",
    },
    {
      id: "i4",
      at: "10:14",
      actor: "Maya Fernando",
      detail: "Room released six minutes early. Guest escorted up by Front Office.",
    },
  ],
};

/* -------------------------------------------------------------------------- */
/* Lookups                                                                    */
/* -------------------------------------------------------------------------- */

export function getSop(id: string): Sop | undefined {
  return SOPS.find((s) => s.id === id);
}

export function getCourse(id: string): Course | undefined {
  return COURSES.find((c) => c.id === id);
}

export function getCourseForSop(sopId: string): Course | undefined {
  return COURSES.find((c) => c.sopId === sopId);
}

export function getTask(id: string): ShiftTask | undefined {
  return SHIFT_TASKS.find((t) => t.id === id);
}

export const ACTIVE_TASK = SHIFT_TASKS.find((t) => t.status === "active")!;

export function stepCount(sop: Sop): number {
  return sop.phases.reduce((total, phase) => total + phase.steps.length, 0);
}
