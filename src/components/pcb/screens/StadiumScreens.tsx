import { useState } from "react";
import {
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Flag,
  Footprints,
  MapPinned,
  Navigation,
  Search,
  WifiOff,
  Accessibility,
  Cross,
  DoorOpen,
  LifeBuoy,
  Info,
  Moon,
  Toilet,
} from "lucide-react";
import {
  BLOCKS,
  FACILITIES,
  FACILITY_CATEGORIES,
  MAP_POINTS,
  RULES,
  SEAT_ROUTE,
  getMatch,
  FEATURED_MATCH_ID,
} from "@/lib/pcb-data";
import { usePcb } from "@/lib/pcb-store";
import { cn } from "@/lib/utils";
import { Card, Chip, ConnectivityPill, PrimaryButton, Screen, SectionTitle, TopBar } from "../kit";

const CATEGORY_ICONS: Record<string, typeof Toilet> = {
  Washrooms: Toilet,
  Medical: Cross,
  "Prayer Area": Moon,
  Accessibility: Accessibility,
  "Help Desk": LifeBuoy,
  Exits: DoorOpen,
  Information: Info,
};

/* ── Stadium overview map ──────────────────────────────────── */

export function StadiumScreen() {
  const { go, ticket, offline } = usePcb();
  const m = getMatch(FEATURED_MATCH_ID);
  const [highlight, setHighlight] = useState<string | null>(ticket?.block ?? null);

  return (
    <Screen>
      <TopBar title="Stadium" subtitle={`${m.venue}, ${m.city}`} right={<ConnectivityPill />} />

      {offline && (
        <Card className="mb-3 border-warning/40 bg-warning/8">
          <p className="flex items-center gap-2 text-xs font-semibold text-warning">
            <WifiOff className="h-3.5 w-3.5" /> Offline map loaded from your Match Pass
          </p>
        </Card>
      )}

      <div className="overflow-hidden rounded-3xl bg-pitch p-4">
        <div className="relative aspect-square w-full rounded-2xl bg-[oklch(0.3_0.07_158)]">
          <div className="absolute left-1/2 top-1/2 h-[52%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[oklch(0.42_0.11_150)]">
            <div className="absolute left-1/2 top-1/2 h-[44%] w-[8%] -translate-x-1/2 -translate-y-1/2 rounded-sm bg-[oklch(0.82_0.05_92)]" />
          </div>

          {BLOCKS.map((b) => (
            <button
              key={b.id}
              onClick={() => setHighlight(b.id === highlight ? null : b.id)}
              className={cn(
                "absolute grid place-items-center rounded-lg border text-[10px] font-bold transition active:scale-95",
                highlight === b.id
                  ? "border-gold bg-gold text-gold-foreground"
                  : "border-white/30 bg-white/12 text-white/85",
              )}
              style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%` }}
            >
              {b.id}
            </button>
          ))}

          {MAP_POINTS.map((p) => (
            <span
              key={p.id}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-1.5 py-[2px] text-[8px] font-bold",
                p.type === "gate" ? "bg-gold text-gold-foreground" : "bg-white/85 text-pitch",
              )}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              {p.label}
            </span>
          ))}
        </div>

        {ticket && (
          <p className="mt-3 text-[11px] text-white/65">
            Your seat: Block {ticket.block} · Row {ticket.row} · Seat {ticket.seat} · Enter via {ticket.gate}
          </p>
        )}
      </div>

      <SectionTitle>Navigate</SectionTitle>
      <div className="grid grid-cols-2 gap-3">
        <Card onClick={() => go("wayfinding", { beat: "turn" })}>
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-secondary text-primary">
            <Navigation className="h-4 w-4" />
          </span>
          <p className="mt-2.5 font-display text-[13px] font-bold">Find my seat</p>
          <p className="text-[11px] text-muted-foreground">Step-by-step, works offline</p>
        </Card>
        <Card onClick={() => go("facilities")}>
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-secondary text-primary">
            <MapPinned className="h-4 w-4" />
          </span>
          <p className="mt-2.5 font-display text-[13px] font-bold">Facilities</p>
          <p className="text-[11px] text-muted-foreground">Nearest amenities</p>
        </Card>
      </div>

      <SectionTitle>Gates</SectionTitle>
      <Card>
        {["Gate 1 · Premium Enclosure", "Gate 2 · Block C", "Gate 3 · Block B", "Gate 4 · General Enclosure"].map((g) => (
          <p key={g} className="border-b border-border/70 py-2.5 text-sm last:border-0">
            {g}
          </p>
        ))}
      </Card>

      <SectionTitle>Know before you go</SectionTitle>
      <Card onClick={() => go("rules")}>
        <p className="text-sm font-semibold">Rules, prohibited items & emergency info</p>
        <p className="mt-1 text-xs text-muted-foreground">Saved offline with your Match Pass.</p>
      </Card>
      <div className="h-4" />
    </Screen>
  );
}

/* ── Wayfinding ────────────────────────────────────────────── */

const DIR_ICON = {
  straight: ArrowUp,
  left: ArrowLeft,
  right: ArrowRight,
  up: Footprints,
  arrive: Flag,
} as const;

export function WayfindingScreen() {
  const { back, ticket, offline } = usePcb();
  const [step, setStep] = useState(0);
  const current = SEAT_ROUTE[step]!;
  const last = step === SEAT_ROUTE.length - 1;

  return (
    <Screen nav={false} className="pb-10">
      <TopBar
        title="Find my seat"
        subtitle={ticket ? `Block ${ticket.block} · Row ${ticket.row} · Seat ${ticket.seat}` : "Block B · Row 12 · Seat 18"}
        onBack={back}
        right={<ConnectivityPill />}
      />

      <div className="overflow-hidden rounded-3xl bg-pitch p-4">
        <svg viewBox="0 0 100 100" className="aspect-square w-full rounded-2xl bg-[oklch(0.3_0.07_158)]">
          <ellipse cx="50" cy="50" rx="31" ry="26" fill="oklch(0.42 0.11 150)" />
          <rect x="47" y="38" width="6" height="24" rx="1" fill="oklch(0.82 0.05 92)" />
          {BLOCKS.map((b) => (
            <g key={b.id}>
              <rect
                x={b.x}
                y={b.y}
                width={b.w}
                height={b.h}
                rx="2"
                fill={ticket?.block === b.id ? "oklch(0.79 0.125 84)" : "rgba(255,255,255,0.12)"}
              />
              <text
                x={b.x + b.w / 2}
                y={b.y + b.h / 2 + 2}
                textAnchor="middle"
                fontSize="5"
                fontWeight="700"
                fill={ticket?.block === b.id ? "oklch(0.28 0.06 70)" : "rgba(255,255,255,0.7)"}
              >
                {b.id}
              </text>
            </g>
          ))}
          <polyline
            key={step}
            className="route-draw"
            points="50,98 76,88 92,66 94,48 88,38 80,34"
            fill="none"
            stroke="oklch(0.79 0.125 84)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="80" cy="34" r="3" fill="oklch(0.79 0.125 84)" />
          <circle cx="50" cy="98" r="2.5" fill="white" />
        </svg>
        <p className="mt-3 text-[11px] text-white/60">
          {offline ? "Offline route · no GPS required" : "Live route from the main entrance plaza"}
        </p>
      </div>

      <Card className="mt-4 border-gold/40 bg-gold/8">
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-pitch text-primary-foreground">
            {(() => {
              const Icon = DIR_ICON[current.direction];
              return <Icon className="h-5 w-5" />;
            })()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-[15px] font-bold">{current.title}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{current.detail}</p>
          </div>
          <span className="shrink-0 font-display text-xs font-bold text-primary">{current.distance}</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-gold/30 pt-3">
          <PrimaryButton variant="outline" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>
            Previous
          </PrimaryButton>
          <PrimaryButton disabled={last} onClick={() => setStep((s) => Math.min(SEAT_ROUTE.length - 1, s + 1))}>
            {last ? "Arrived" : "Next step"}
          </PrimaryButton>
        </div>
      </Card>

      <SectionTitle>Full route</SectionTitle>
      <Card className="p-2">
        {SEAT_ROUTE.map((s, i) => (
          <button
            key={s.title}
            onClick={() => setStep(i)}
            className="flex w-full items-start gap-3 border-b border-border/70 px-2 py-3 text-left last:border-0"
          >
            <span
              className={cn(
                "grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-bold",
                i < step ? "bg-success/15 text-success" : i === step ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground",
              )}
            >
              {i + 1}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium leading-snug">{s.title}</span>
              <span className="block text-[11px] text-muted-foreground">{s.distance}</span>
            </span>
          </button>
        ))}
      </Card>
      <div className="h-6" />
    </Screen>
  );
}

/* ── Facilities ────────────────────────────────────────────── */

export function FacilitiesScreen() {
  const { back, offline } = usePcb();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const list = FACILITIES.filter(
    (f) =>
      (cat === "All" || f.category === cat) &&
      (q === "" || f.name.toLowerCase().includes(q.toLowerCase()) || f.category.toLowerCase().includes(q.toLowerCase())),
  ).sort((a, b) => a.distance - b.distance);

  return (
    <Screen>
      <TopBar title="Facilities" subtitle="Nearest to Block B, Row 12" onBack={back} right={<ConnectivityPill />} />

      <div className="relative mb-3">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search washrooms, prayer area, medical…"
          className="h-12 w-full rounded-2xl border border-border bg-surface pl-10 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/30"
        />
      </div>

      <div className="no-scrollbar -mx-5 mb-4 flex gap-2 overflow-x-auto px-5">
        {["All", ...FACILITY_CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-2 text-xs font-bold transition active:scale-95",
              cat === c ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {offline && (
        <p className="mb-3 flex items-center gap-1.5 text-[11px] text-warning">
          <WifiOff className="h-3 w-3" /> Directory served from your offline Match Pass
        </p>
      )}

      <div className="space-y-3">
        {list.map((f) => {
          const Icon = CATEGORY_ICONS[f.category] ?? Info;
          return (
            <Card key={f.id}>
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold leading-snug">{f.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{f.direction}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{f.detail}</p>
                </div>
                <Chip tone="green">{f.distance} m</Chip>
              </div>
            </Card>
          );
        })}
        {list.length === 0 && (
          <Card><p className="text-sm text-muted-foreground">No facilities match that search.</p></Card>
        )}
      </div>
      <div className="h-4" />
    </Screen>
  );
}

/* ── Rules ─────────────────────────────────────────────────── */

export function RulesScreen() {
  const { back } = usePcb();
  const [open, setOpen] = useState<string | null>(RULES[0]!.q);

  return (
    <Screen>
      <TopBar title="Know before you go" subtitle="Rules & stadium information" onBack={back} right={<ConnectivityPill />} />

      <Card className="mb-3 border-destructive/30 bg-destructive/8">
        <p className="text-sm font-semibold text-destructive">Emergency: 1122 (Rescue)</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Ground marshal desk at Gate 3 · Follow lit green exit arrows in an evacuation.
        </p>
      </Card>

      <div className="space-y-2.5">
        {RULES.map((r) => {
          const isOpen = open === r.q;
          return (
            <Card key={r.q} className={cn(isOpen && "border-primary/40")}>
              <button
                onClick={() => setOpen(isOpen ? null : r.q)}
                className="flex w-full items-center gap-3 text-left"
              >
                <span className="min-w-0 flex-1 font-display text-sm font-bold">{r.q}</span>
                <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition", isOpen && "rotate-180")} />
              </button>
              {isOpen && <p className="screen-in mt-2.5 text-xs leading-relaxed text-muted-foreground">{r.a}</p>}
            </Card>
          );
        })}
      </div>
      <div className="h-4" />
    </Screen>
  );
}
