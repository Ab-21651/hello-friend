// Mock data layer for the PCB fan-experience POC.
// Everything here is local + synchronous so the entire app works offline.
// Swap these exports for API calls later without touching the UI.

export type MatchType = "T20I" | "ODI" | "Test" | "PSL";

export interface Team {
  code: string;
  name: string;
  short: string;
  flag: string;
}

export interface Match {
  id: string;
  home: Team;
  away: Team;
  series: string;
  type: MatchType;
  venue: string;
  city: string;
  dateISO: string;
  timeLabel: string;
  dateLabel: string;
  availability: "High" | "Limited" | "Sold Out";
  featured?: boolean;
}

export const TEAMS = {
  PAK: { code: "PAK", name: "Pakistan", short: "PAK", flag: "🇵🇰" },
  ENG: { code: "ENG", name: "England", short: "ENG", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  AUS: { code: "AUS", name: "Australia", short: "AUS", flag: "🇦🇺" },
  NZ: { code: "NZ", name: "New Zealand", short: "NZ", flag: "🇳🇿" },
  SA: { code: "SA", name: "South Africa", short: "SA", flag: "🇿🇦" },
  SL: { code: "SL", name: "Sri Lanka", short: "SL", flag: "🇱🇰" },
} satisfies Record<string, Team>;

export const FEATURED_MATCH_ID = "m-pak-eng-rwp";

export const MATCHES: Match[] = [
  {
    id: FEATURED_MATCH_ID,
    home: TEAMS.PAK,
    away: TEAMS.ENG,
    series: "Pakistan v England T20I Series 2026",
    type: "T20I",
    venue: "Rawalpindi Cricket Stadium",
    city: "Rawalpindi",
    dateISO: "2026-10-15T16:30:00+05:00",
    timeLabel: "4:30 PM",
    dateLabel: "15 Oct 2026",
    availability: "Limited",
    featured: true,
  },
  {
    id: "m-pak-eng-lhr",
    home: TEAMS.PAK,
    away: TEAMS.ENG,
    series: "Pakistan v England T20I Series 2026",
    type: "T20I",
    venue: "Gaddafi Stadium",
    city: "Lahore",
    dateISO: "2026-10-18T19:00:00+05:00",
    timeLabel: "7:00 PM",
    dateLabel: "18 Oct 2026",
    availability: "High",
  },
  {
    id: "m-pak-nz-khi",
    home: TEAMS.PAK,
    away: TEAMS.NZ,
    series: "Pakistan v New Zealand ODI Series 2026",
    type: "ODI",
    venue: "National Bank Stadium",
    city: "Karachi",
    dateISO: "2026-11-02T14:00:00+05:00",
    timeLabel: "2:00 PM",
    dateLabel: "02 Nov 2026",
    availability: "High",
  },
  {
    id: "m-pak-aus-mul",
    home: TEAMS.PAK,
    away: TEAMS.AUS,
    series: "Pakistan v Australia Test Series 2026",
    type: "Test",
    venue: "Multan Cricket Stadium",
    city: "Multan",
    dateISO: "2026-11-14T10:00:00+05:00",
    timeLabel: "10:00 AM",
    dateLabel: "14 Nov 2026",
    availability: "Limited",
  },
  {
    id: "m-pak-sa-rwp",
    home: TEAMS.PAK,
    away: TEAMS.SA,
    series: "Pakistan v South Africa T20I Series 2026",
    type: "T20I",
    venue: "Rawalpindi Cricket Stadium",
    city: "Rawalpindi",
    dateISO: "2026-11-25T19:00:00+05:00",
    timeLabel: "7:00 PM",
    dateLabel: "25 Nov 2026",
    availability: "Sold Out",
  },
];

export const getMatch = (id: string) => MATCHES.find((m) => m.id === id) ?? MATCHES[0]!;

/* ── Ticketing ─────────────────────────────────────────────── */

export interface TicketCategory {
  id: string;
  name: string;
  desc: string;
  price: number;
  blocks: string[];
  perks: string[];
  left: number;
}

export const CATEGORIES: TicketCategory[] = [
  {
    id: "premium",
    name: "Premium Enclosure",
    desc: "Lower tier, closest to the boundary rope",
    price: 12000,
    blocks: ["A"],
    perks: ["Padded seating", "Dedicated Gate 1", "Covered"],
    left: 84,
  },
  {
    id: "first",
    name: "First Class Enclosure",
    desc: "Mid tier, elevated square-of-the-wicket view",
    price: 6500,
    blocks: ["B", "C"],
    perks: ["Shaded rows", "Gate 3 access", "Near facilities"],
    left: 412,
  },
  {
    id: "general",
    name: "General Enclosure",
    desc: "Upper tier, full-ground panoramic view",
    price: 2500,
    blocks: ["D", "E"],
    perks: ["Open air", "Gate 4 access"],
    left: 2160,
  },
];

export interface Block {
  id: string;
  label: string;
  category: string;
  gate: string;
  rows: number;
  seatsPerRow: number;
  soldOut?: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
  tone: "premium" | "first" | "general";
}

export const BLOCKS: Block[] = [
  { id: "A", label: "Block A", category: "premium", gate: "Gate 1", rows: 10, seatsPerRow: 12, x: 32, y: 8, w: 36, h: 16, tone: "premium" },
  { id: "B", label: "Block B", category: "first", gate: "Gate 3", rows: 16, seatsPerRow: 22, x: 70, y: 26, w: 22, h: 34, tone: "first" },
  { id: "C", label: "Block C", category: "first", gate: "Gate 2", rows: 16, seatsPerRow: 22, x: 8, y: 26, w: 22, h: 34, tone: "first" },
  { id: "D", label: "Block D", category: "general", gate: "Gate 4", rows: 20, seatsPerRow: 26, x: 26, y: 74, w: 48, h: 18, tone: "general" },
  { id: "E", label: "Block E", category: "general", gate: "Gate 4", rows: 20, seatsPerRow: 26, x: 8, y: 63, w: 16, h: 12, tone: "general", soldOut: true },
];

export const SERVICE_FEE = 350;

// Deterministic pseudo-random availability so the map is stable across renders.
export function seatAvailable(block: string, row: number, seat: number) {
  const h = (block.charCodeAt(0) * 31 + row * 17 + seat * 7) % 11;
  return h > 2;
}

export const HOLDER_NAME = "Abdullah Attique";

/* ── Stadium companion ─────────────────────────────────────── */

export interface Facility {
  id: string;
  name: string;
  category: string;
  distance: number;
  direction: string;
  detail: string;
  x: number;
  y: number;
}

export const FACILITIES: Facility[] = [
  { id: "f1", name: "Washrooms — Block B Concourse", category: "Washrooms", distance: 40, direction: "Left after your row entrance", detail: "Open all match · Accessible stall available", x: 82, y: 30 },
  { id: "f2", name: "Medical Post 2", category: "Medical", distance: 95, direction: "Concourse east, next to Gate 3", detail: "Paramedic on duty · First aid & ORS", x: 88, y: 44 },
  { id: "f3", name: "Prayer Area (Namaz)", category: "Prayer Area", distance: 120, direction: "Behind Block B, lower level", detail: "Wudhu facility · Separate ladies section", x: 90, y: 60 },
  { id: "f4", name: "Accessibility Ramp B", category: "Accessibility", distance: 60, direction: "Right of Gate 3 turnstiles", detail: "Wheelchair access to rows 1–6", x: 76, y: 22 },
  { id: "f5", name: "Help Desk — East Concourse", category: "Help Desk", distance: 70, direction: "Straight ahead from Gate 3", detail: "Lost & found · Ticket support", x: 84, y: 52 },
  { id: "f6", name: "Emergency Exit E3", category: "Exits", distance: 55, direction: "End of Block B walkway", detail: "Keep clear · Stewards posted", x: 94, y: 34 },
  { id: "f7", name: "Information Kiosk", category: "Information", distance: 150, direction: "Main plaza, outside Gate 3", detail: "Match programmes · Stadium queries", x: 70, y: 12 },
  { id: "f8", name: "Food Court — East", category: "Information", distance: 110, direction: "Concourse east wing", detail: "Cash & card · Halal certified", x: 86, y: 66 },
];

export const FACILITY_CATEGORIES = [
  "Washrooms",
  "Medical",
  "Prayer Area",
  "Accessibility",
  "Help Desk",
  "Exits",
  "Information",
];

export interface RouteStep {
  title: string;
  detail: string;
  distance: string;
  direction: "straight" | "left" | "right" | "up" | "arrive";
}

export const SEAT_ROUTE: RouteStep[] = [
  { title: "Main Entrance Plaza", detail: "Security screening · Have your Match Pass QR ready", distance: "0 m", direction: "straight" },
  { title: "Head east along the outer ring", detail: "Follow the green PCB signage towards Gates 2–3", distance: "80 m", direction: "right" },
  { title: "Gate 3 — Your assigned entrance", detail: "Turnstile 3B · Scan Match Pass · Bag check", distance: "140 m", direction: "straight" },
  { title: "Concourse level, Block B stair 4", detail: "Washrooms on your left, medical post on your right", distance: "165 m", direction: "up" },
  { title: "Block B, Row 12", detail: "Rows are numbered from the front; 12 is mid-tier", distance: "178 m", direction: "left" },
  { title: "Seat 18 — You've arrived", detail: "Aisle is 4 seats to your right", distance: "180 m", direction: "arrive" },
];

export const MAP_POINTS = [
  { id: "g1", label: "Gate 1", type: "gate", x: 50, y: 4 },
  { id: "g2", label: "Gate 2", type: "gate", x: 6, y: 44 },
  { id: "g3", label: "Gate 3", type: "gate", x: 94, y: 44 },
  { id: "g4", label: "Gate 4", type: "gate", x: 50, y: 96 },
  { id: "wr", label: "WC", type: "washroom", x: 80, y: 22 },
  { id: "wr2", label: "WC", type: "washroom", x: 20, y: 22 },
  { id: "md", label: "Medical", type: "medical", x: 86, y: 62 },
  { id: "pr", label: "Prayer", type: "prayer", x: 14, y: 62 },
  { id: "ac", label: "Access", type: "access", x: 30, y: 92 },
  { id: "hd", label: "Help", type: "help", x: 68, y: 92 },
  { id: "ex", label: "Exit", type: "exit", x: 94, y: 76 },
  { id: "ex2", label: "Exit", type: "exit", x: 6, y: 76 },
] as const;

/* ── Know before you go ────────────────────────────────────── */

export const RULES = [
  {
    q: "Prohibited items",
    a: "Water bottles (any size), power banks, laptops, umbrellas, laser pointers, flares, drones, aerosols, sharp objects, outside food and beverages. Sealed water is provided free inside the ground.",
  },
  {
    q: "Entry requirements",
    a: "A valid digital Match Pass on this app plus original CNIC / B-Form / passport of the ticket holder. Tickets are device-bound and non-transferable.",
  },
  {
    q: "Gate opening times",
    a: "Gates open 3 hours before the first ball (1:30 PM for a 4:30 PM start) and close 30 minutes after play begins. Arrive early — security screening peaks 60–90 minutes before start.",
  },
  {
    q: "Security & screening",
    a: "All spectators pass through walk-through gates and a pat-down. Bags larger than an A4 folder are not permitted. Cooperate with stewards and Rawalpindi Police at all times.",
  },
  {
    q: "Ticket rules",
    a: "One entry per ticket. Re-entry is not permitted once scanned. Screenshots and forwarded images will not be accepted; the QR rotates every 30 seconds.",
  },
  {
    q: "Emergency information",
    a: "Stadium control room: 1122 (Rescue) · Ground marshal: Gate 3 desk. In an evacuation, follow lit green exit arrows to your nearest exit and do not use the stair you entered by unless directed.",
  },
  {
    q: "Accessibility",
    a: "Wheelchair-accessible seating is available in rows 1–6 of Blocks B and C via Ramp B at Gate 3. One companion ticket is issued free. Assistance desks are staffed at every gate.",
  },
];

export const ANNOUNCEMENTS = [
  {
    id: "a1",
    tag: "Ticketing",
    title: "Rawalpindi T20I tickets now live",
    body: "Premium and First Class enclosures are selling fast for Pakistan v England on 15 October.",
    time: "2h ago",
  },
  {
    id: "a2",
    tag: "Squad",
    title: "Pakistan squad announced for England series",
    body: "A 16-member squad has been named by the national selection committee.",
    time: "Yesterday",
  },
  {
    id: "a3",
    tag: "Advisory",
    title: "Download your Match Pass before travelling",
    body: "Network coverage around the stadium is congested on match day. Offline passes are recommended.",
    time: "2 days ago",
  },
];

/* ── Fan engagement ────────────────────────────────────────── */

export const PREDICTIONS = [
  {
    id: "p1",
    q: "Who takes the first wicket for Pakistan?",
    points: 150,
    options: ["Shaheen Afridi", "Naseem Shah", "Haris Rauf", "Abrar Ahmed"],
  },
  {
    id: "p2",
    q: "Total runs in the powerplay (overs 1–6)?",
    points: 100,
    options: ["Under 40", "40–54", "55–69", "70+"],
  },
];

export const POLLS = [
  { id: "poll1", q: "Man of the match?", options: ["Babar Azam", "Mohammad Rizwan", "Shaheen Afridi", "Saim Ayub"], votes: [42, 27, 21, 10] },
];

export const QUIZ = {
  q: "Which ground hosted Pakistan's first home Test after 2019?",
  options: ["Gaddafi Stadium", "Rawalpindi Cricket Stadium", "National Bank Stadium", "Multan Cricket Stadium"],
  answer: 1,
  points: 50,
};

/* ── Past tickets ──────────────────────────────────────────── */

export const PAST_TICKETS = [
  { id: "PCB-2026-004811", match: "Pakistan v Sri Lanka", type: "ODI", venue: "Gaddafi Stadium, Lahore", date: "22 Mar 2026", seat: "Block C · Row 8 · Seat 4", status: "USED" },
  { id: "PCB-2025-093112", match: "Pakistan v West Indies", type: "T20I", venue: "National Bank Stadium, Karachi", date: "09 Dec 2025", seat: "Block D · Row 3 · Seat 21", status: "USED" },
];

/* ── Admin analytics ───────────────────────────────────────── */

export const ADMIN = {
  ticketsSold: 28450,
  scanned: 21230,
  attendance: 20814,
  validationFailures: 137,
  reuseAttempts: 42,
  avgEntryTime: "38 sec",
  gates: [
    { gate: "Gate 1", entries: 3120, load: "Low" },
    { gate: "Gate 2", entries: 5480, load: "Medium" },
    { gate: "Gate 3", entries: 8940, load: "High" },
    { gate: "Gate 4", entries: 3690, load: "Medium" },
  ],
  sections: [
    { block: "Block A", pct: 92 },
    { block: "Block B", pct: 88 },
    { block: "Block C", pct: 74 },
    { block: "Block D", pct: 63 },
    { block: "Block E", pct: 41 },
  ],
  feedback: 4.6,
  issues: [
    { id: "i1", text: "Water point dry — Block D concourse", severity: "Medium", time: "17:42" },
    { id: "i2", text: "Turnstile 2A intermittent scanner fault", severity: "High", time: "17:05" },
    { id: "i3", text: "Crowd build-up at Gate 3 outer ring", severity: "Medium", time: "16:20" },
  ],
};

export const currency = (n: number) => `PKR ${n.toLocaleString("en-PK")}`;
