import { useMemo, useState } from "react";
import {
  Check,
  ChevronRight,
  CreditCard,
  Download,
  Eye,
  Info,
  ShieldCheck,
  Ticket as TicketIcon,
  Wallet,
  WifiOff,
  CircleCheck,
  Armchair,
  DoorOpen,
  MapPinned,
  BookOpen,
} from "lucide-react";
import viewFromSeat from "@/assets/view-from-seat.jpg";
import viewFromSeatPremium from "@/assets/view-from-seat-premium.jpg";
import {
  BLOCKS,
  CATEGORIES,
  HOLDER_NAME,
  PAST_TICKETS,
  SERVICE_FEE,
  currency,
  getMatch,
  seatAvailable,
  FEATURED_MATCH_ID,
} from "@/lib/pcb-data";
import { usePcb, useRotatingCode } from "@/lib/pcb-store";
import { cn } from "@/lib/utils";
import { QrBlock } from "../QrBlock";
import {
  Card,
  Chip,
  ConnectivityPill,
  DataPair,
  PrimaryButton,
  Screen,
  SectionTitle,
  StickyFooter,
  TopBar,
} from "../kit";

/* ── 1. Choose a category ──────────────────────────────────── */

export function BuyCategoryScreen() {
  const { back, go, setDraft, screen } = usePcb();
  const matchId = screen.params?.["id"] ?? FEATURED_MATCH_ID;
  const m = getMatch(matchId);
  const [selected, setSelected] = useState(CATEGORIES[1]!.id);
  const cat = CATEGORIES.find((c) => c.id === selected)!;

  return (
    <>
      <Screen nav={false} className="pb-32">
        <TopBar title="Select tickets" subtitle={`${m.home.short} v ${m.away.short} · ${m.dateLabel}`} onBack={back} />
        <p className="mb-3 text-xs text-muted-foreground">
          Pick an enclosure. You'll choose your exact seat next.
        </p>
        <div className="space-y-3">
          {CATEGORIES.map((c) => {
            const active = c.id === selected;
            return (
              <Card
                key={c.id}
                onClick={() => setSelected(c.id)}
                className={cn(active && "border-primary bg-accent/40 ring-1 ring-primary")}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-display text-sm font-bold">{c.name}</p>
                      {active && <CircleCheck className="h-4 w-4 text-primary" />}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{c.desc}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {c.perks.map((p) => (
                        <Chip key={p}>{p}</Chip>
                      ))}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-display text-sm font-extrabold text-primary">{currency(c.price)}</p>
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {c.left.toLocaleString()} left
                    </p>
                  </div>
                </div>
                <div className="mt-3 border-t border-border pt-2 text-[11px] text-muted-foreground">
                  Blocks {c.blocks.join(", ")}
                </div>
              </Card>
            );
          })}
        </div>

        <SectionTitle>Good to know</SectionTitle>
        <Card>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li className="flex gap-2"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" /> One ticket per CNIC per match. Tickets are device-bound.</li>
            <li className="flex gap-2"><ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" /> A {currency(SERVICE_FEE)} service fee applies per ticket.</li>
          </ul>
        </Card>
      </Screen>
      <StickyFooter>
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{cat.name}</span>
          <span className="font-display font-extrabold">{currency(cat.price)}</span>
        </div>
        <PrimaryButton
          onClick={() => {
            setDraft({ categoryId: cat.id, price: cat.price });
            go("seatMap", { params: { id: matchId }, beat: "lean" });
          }}
        >
          Choose seat <ChevronRight className="h-4 w-4" />
        </PrimaryButton>
      </StickyFooter>
    </>
  );
}

/* ── 2. Seat map ───────────────────────────────────────────── */

export function SeatMapScreen() {
  const { back, go, draft, setDraft, screen } = usePcb();
  const matchId = screen.params?.["id"] ?? FEATURED_MATCH_ID;
  const cat = CATEGORIES.find((c) => c.id === draft.categoryId) ?? CATEGORIES[1]!;
  const catBlocks = BLOCKS.filter((b) => cat.blocks.includes(b.id));
  const [blockId, setBlockId] = useState(draft.block ?? catBlocks[0]!.id);
  const block = BLOCKS.find((b) => b.id === blockId) ?? catBlocks[0]!;
  const [row, setRow] = useState(draft.row ?? 12);
  const [seat, setSeat] = useState<number | null>(draft.seat ?? null);

  const rows = useMemo(() => Array.from({ length: block.rows }, (_, i) => i + 1), [block.rows]);
  const seats = useMemo(
    () => Array.from({ length: block.seatsPerRow }, (_, i) => i + 1),
    [block.seatsPerRow],
  );

  return (
    <>
      <Screen nav={false} className="pb-32">
        <TopBar title="Choose your seat" subtitle={`${cat.name} · ${currency(cat.price)}`} onBack={back} right={<ConnectivityPill />} />

        {/* Stadium plan */}
        <div className="relative overflow-hidden rounded-3xl bg-pitch p-4">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-white/50">
            Rawalpindi Cricket Stadium
          </p>
          <div className="relative aspect-[4/3] w-full rounded-2xl bg-[oklch(0.3_0.07_158)]">
            {/* outfield + pitch */}
            <div className="absolute left-1/2 top-1/2 h-[58%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[oklch(0.42_0.11_150)]">
              <div className="absolute left-1/2 top-1/2 h-[46%] w-[9%] -translate-x-1/2 -translate-y-1/2 rounded-sm bg-[oklch(0.82_0.05_92)]" />
            </div>
            {BLOCKS.map((b) => {
              const selectable = cat.blocks.includes(b.id) && !b.soldOut;
              const active = b.id === blockId;
              return (
                <button
                  key={b.id}
                  disabled={!selectable}
                  onClick={() => {
                    setBlockId(b.id);
                    setSeat(null);
                  }}
                  className={cn(
                    "absolute grid place-items-center rounded-lg border text-[10px] font-bold transition",
                    active
                      ? "border-gold bg-gold text-gold-foreground"
                      : selectable
                        ? "border-white/40 bg-white/15 text-white active:scale-95"
                        : "border-white/10 bg-white/5 text-white/35",
                  )}
                  style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%` }}
                >
                  {b.id}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-white/60">
            <Legend className="bg-gold" label="Selected block" />
            <Legend className="bg-white/25" label="Available" />
            <Legend className="bg-white/8" label="Unavailable" />
          </div>
        </div>

        <SectionTitle>Row</SectionTitle>
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5">
          {rows.map((r) => (
            <button
              key={r}
              onClick={() => {
                setRow(r);
                setSeat(null);
              }}
              className={cn(
                "h-10 w-10 shrink-0 rounded-xl text-xs font-bold transition active:scale-95",
                r === row ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground",
              )}
            >
              {r}
            </button>
          ))}
        </div>

        <SectionTitle>Seats in {block.label}, Row {row}</SectionTitle>
        <Card>
          <div className="mb-3 h-1.5 w-full rounded-full bg-secondary" />
          <div className="grid grid-cols-8 gap-1.5">
            {seats.map((s) => {
              const free = seatAvailable(block.id, row, s);
              const active = seat === s;
              return (
                <button
                  key={s}
                  disabled={!free}
                  onClick={() => setSeat(s)}
                  aria-label={`Seat ${s}${free ? "" : " unavailable"}`}
                  className={cn(
                    "grid h-8 place-items-center rounded-lg text-[10px] font-bold transition",
                    active
                      ? "bg-gold text-gold-foreground"
                      : free
                        ? "bg-success/15 text-success active:scale-90"
                        : "bg-secondary text-muted-foreground/40 line-through",
                  )}
                >
                  {s}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex flex-wrap gap-3 border-t border-border pt-3 text-[10px] text-muted-foreground">
            <Legend className="bg-success/40" label="Available" dark />
            <Legend className="bg-gold" label="Your seat" dark />
            <Legend className="bg-secondary" label="Taken" dark />
          </div>
        </Card>
      </Screen>

      <StickyFooter>
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            {seat ? `${block.label} · Row ${row} · Seat ${seat}` : "Select a seat"}
          </span>
          <span className="font-display font-extrabold">{currency(cat.price)}</span>
        </div>
        <PrimaryButton
          disabled={!seat}
          onClick={() => {
            setDraft({ block: block.id, row, seat: seat!, gate: block.gate, price: cat.price, categoryId: cat.id });
            go("seatDetail", { params: { id: matchId }, beat: "lean" });
          }}
        >
          <Eye className="h-4 w-4" /> View from this seat
        </PrimaryButton>
      </StickyFooter>
    </>
  );
}

function Legend({ className, label, dark }: { className: string; label: string; dark?: boolean }) {
  return (
    <span className={cn("flex items-center gap-1.5", dark ? "text-muted-foreground" : "text-white/60")}>
      <span className={cn("h-2.5 w-2.5 rounded-sm", className)} /> {label}
    </span>
  );
}

/* ── 3. Seat detail ────────────────────────────────────────── */

export function SeatDetailScreen() {
  const { back, go, draft, screen } = usePcb();
  const matchId = screen.params?.["id"] ?? FEATURED_MATCH_ID;
  const cat = CATEGORIES.find((c) => c.id === draft.categoryId) ?? CATEGORIES[1]!;
  const premium = cat.id === "premium";
  const block = BLOCKS.find((b) => b.id === draft.block) ?? BLOCKS[1]!;

  return (
    <>
      <Screen pad={false} nav={false} className="pb-32">
        <div className="relative h-72">
          <img
            src={premium ? viewFromSeatPremium : viewFromSeat}
            alt={`Representative view of the pitch from ${block.label}, row ${draft.row}`}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/40" />
          <button
            onClick={back}
            className="absolute left-5 top-14 grid h-10 w-10 place-items-center rounded-full bg-black/45 text-white backdrop-blur transition active:scale-95"
          >
            <ChevronRight className="h-5 w-5 rotate-180" />
          </button>
          <div className="absolute inset-x-5 bottom-4">
            <Chip tone="gold">Representative view</Chip>
          </div>
        </div>

        <div className="px-5">
          <h1 className="mt-4 font-display text-xl font-extrabold">
            {block.label} · Row {draft.row} · Seat {draft.seat}
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Image is indicative of the sightline from this tier — not the exact seat.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <Card className="p-3.5"><DataPair label="Enclosure" value={cat.name} /></Card>
            <Card className="p-3.5"><DataPair label="Entry gate" value={block.gate} /></Card>
            <Card className="p-3.5"><DataPair label="Tier" value={premium ? "Lower" : cat.id === "first" ? "Mid" : "Upper"} /></Card>
            <Card className="p-3.5"><DataPair label="Price" value={currency(cat.price)} /></Card>
          </div>

          <SectionTitle>What's nearby</SectionTitle>
          <Card>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex gap-2"><DoorOpen className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" /> {block.gate} turnstiles, ~3 min walk to your row.</li>
              <li className="flex gap-2"><MapPinned className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" /> Washrooms 40 m and a medical post 95 m along the concourse.</li>
              <li className="flex gap-2"><Armchair className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" /> Aisle access within 4 seats; shaded from mid-afternoon.</li>
            </ul>
          </Card>
        </div>
      </Screen>

      <StickyFooter>
        <PrimaryButton onClick={() => go("summary", { params: { id: matchId }, beat: "lean" })}>
          Continue <ChevronRight className="h-4 w-4" />
        </PrimaryButton>
      </StickyFooter>
    </>
  );
}

/* ── 4. Summary & payment ──────────────────────────────────── */

export function SummaryScreen() {
  const { back, go, draft, purchase, screen } = usePcb();
  const matchId = screen.params?.["id"] ?? FEATURED_MATCH_ID;
  const m = getMatch(matchId);
  const cat = CATEGORIES.find((c) => c.id === draft.categoryId) ?? CATEGORIES[1]!;
  const [method, setMethod] = useState("jazzcash");
  const total = cat.price + SERVICE_FEE;

  const methods = [
    { id: "jazzcash", label: "JazzCash", sub: "0300 •••• 412", Icon: Wallet },
    { id: "easypaisa", label: "Easypaisa", sub: "Mobile account", Icon: Wallet },
    { id: "card", label: "Debit / Credit card", sub: "Visa •••• 4821", Icon: CreditCard },
  ];

  return (
    <>
      <Screen nav={false} className="pb-40">
        <TopBar title="Order summary" subtitle="Review and pay" onBack={back} />

        <Card>
          <p className="font-display text-sm font-bold">{m.home.name} v {m.away.name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{m.series}</p>
          <div className="mt-3 grid grid-cols-2 gap-3 border-t border-border pt-3">
            <DataPair label="Venue" value={m.venue} />
            <DataPair label="Date" value={`${m.dateLabel} · ${m.timeLabel}`} />
          </div>
        </Card>

        <SectionTitle>Your seat</SectionTitle>
        <Card>
          <div className="grid grid-cols-4 gap-2">
            <DataPair label="Gate" value={(draft.gate ?? "Gate 3").replace("Gate ", "")} />
            <DataPair label="Block" value={draft.block ?? "B"} />
            <DataPair label="Row" value={draft.row ?? 12} />
            <DataPair label="Seat" value={draft.seat ?? 18} />
          </div>
          <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">{cat.name}</p>
        </Card>

        <SectionTitle>Ticket holder</SectionTitle>
        <Card>
          <div className="grid grid-cols-2 gap-3">
            <DataPair label="Name" value={HOLDER_NAME} />
            <DataPair label="CNIC" value="37405-•••••••-3" />
          </div>
          <p className="mt-3 border-t border-border pt-3 text-[11px] text-muted-foreground">
            Bring this original CNIC to the gate. Tickets are non-transferable.
          </p>
        </Card>

        <SectionTitle>Payment method</SectionTitle>
        <Card className="p-2">
          {methods.map(({ id, label, sub, Icon }) => (
            <button
              key={id}
              onClick={() => setMethod(id)}
              className="flex w-full items-center gap-3 rounded-xl border-b border-border/70 px-2 py-3 text-left last:border-0"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">{label}</span>
                <span className="block text-[11px] text-muted-foreground">{sub}</span>
              </span>
              <span
                className={cn(
                  "grid h-5 w-5 shrink-0 place-items-center rounded-full border",
                  method === id ? "border-primary bg-primary text-primary-foreground" : "border-border",
                )}
              >
                {method === id && <Check className="h-3 w-3" />}
              </span>
            </button>
          ))}
        </Card>

        <SectionTitle>Price breakdown</SectionTitle>
        <Card>
          <PriceRow label={`1 × ${cat.name}`} value={currency(cat.price)} />
          <PriceRow label="Service fee" value={currency(SERVICE_FEE)} />
          <div className="mt-2 flex items-center justify-between border-t border-border pt-3">
            <span className="font-display text-sm font-bold">Total</span>
            <span className="font-display text-base font-extrabold text-primary">{currency(total)}</span>
          </div>
        </Card>
      </Screen>

      <StickyFooter>
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Total payable</span>
          <span className="font-display font-extrabold">{currency(total)}</span>
        </div>
        <PrimaryButton
          onClick={() => {
            purchase(matchId);
            go("confirmation", { beat: "drop" });
          }}
        >
          Pay {currency(total)}
        </PrimaryButton>
      </StickyFooter>
    </>
  );
}

function PriceRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

/* ── 5. Confirmation ───────────────────────────────────────── */

export function ConfirmationScreen() {
  const { go, ticket } = usePcb();
  if (!ticket) return null;
  const m = getMatch(ticket.matchId);

  return (
    <Screen nav={false} className="pt-24">
      <div className="flex flex-col items-center text-center">
        <span className="tick-in grid h-20 w-20 place-items-center rounded-full bg-success/15 text-success">
          <Check className="h-10 w-10" strokeWidth={3} />
        </span>
        <h1 className="mt-5 font-display text-2xl font-extrabold">Payment successful</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Your ticket for {m.home.short} v {m.away.short} is confirmed.
        </p>
        <Chip tone="gold" className="mt-3">Booking {ticket.id}</Chip>
      </div>

      <Card className="mt-6">
        <div className="grid grid-cols-4 gap-2">
          <DataPair label="Gate" value={ticket.gate.replace("Gate ", "")} />
          <DataPair label="Block" value={ticket.block} />
          <DataPair label="Row" value={ticket.row} />
          <DataPair label="Seat" value={ticket.seat} />
        </div>
        <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
          {m.venue}, {m.city} · {m.dateLabel} · {m.timeLabel} PKT
        </p>
      </Card>

      <Card className="mt-3 border-gold/40 bg-gold/8">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <Download className="h-4 w-4 text-gold-foreground" /> Next: download your Match Pass
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Saves your QR, gate route and stadium map to this device so entry works with no signal.
        </p>
      </Card>

      <div className="mt-6 space-y-3">
        <PrimaryButton onClick={() => go("ticket", { beat: "flip" })}>
          <TicketIcon className="h-4 w-4" /> View digital ticket
        </PrimaryButton>
        <PrimaryButton variant="outline" onClick={() => go("matchPass", { beat: "drop" })}>
          Set up offline Match Pass
        </PrimaryButton>
      </div>
    </Screen>
  );
}

/* ── 6. Digital ticket ─────────────────────────────────────── */

export function TicketScreen() {
  const { back, go, ticket, offline } = usePcb();
  const { code, left } = useRotatingCode(true);
  if (!ticket) {
    return (
      <Screen>
        <TopBar title="Ticket" onBack={back} />
        <Card><p className="text-sm text-muted-foreground">No active ticket.</p></Card>
      </Screen>
    );
  }
  const m = getMatch(ticket.matchId);
  const used = ticket.status === "USED";

  return (
    <Screen nav={false} className="pt-2">
      <TopBar
        title="Digital Ticket"
        subtitle={ticket.id}
        onBack={back}
        right={<Chip tone={used ? "red" : ticket.status === "SCANNED" ? "amber" : "green"}>{ticket.status}</Chip>}
      />

      <div className="overflow-hidden rounded-3xl border border-border bg-surface">
        <div className="bg-pitch p-5 text-primary-foreground">
          <div className="flex items-center justify-between">
            <Chip tone="gold">{m.type}</Chip>
            <span className="text-[11px] text-white/60">{m.dateLabel} · {m.timeLabel}</span>
          </div>
          <p className="mt-3 font-display text-lg font-extrabold">
            {m.home.name} v {m.away.name}
          </p>
          <p className="text-xs text-white/60">{m.venue}, {m.city}</p>
        </div>

        {/* perforation */}
        <div className="relative h-6 bg-surface">
          <span className="absolute -left-3 top-0 h-6 w-6 rounded-full bg-background" />
          <span className="absolute -right-3 top-0 h-6 w-6 rounded-full bg-background" />
          <span className="absolute inset-x-5 top-1/2 border-t border-dashed border-border" />
        </div>

        <div className="px-5 pb-5">
          <div className="grid grid-cols-4 gap-2">
            <DataPair label="Gate" value={ticket.gate.replace("Gate ", "")} />
            <DataPair label="Block" value={ticket.block} />
            <DataPair label="Row" value={ticket.row} />
            <DataPair label="Seat" value={ticket.seat} />
          </div>

          <div className="mt-4 flex flex-col items-center rounded-2xl border border-border bg-surface-2 p-4">
            <div className={cn("rounded-xl bg-white p-3 text-foreground", used && "opacity-30 grayscale")}>
              <QrBlock code={used ? "USED" : code} size={168} />
            </div>
            {used ? (
              <p className="mt-3 text-xs font-bold uppercase tracking-wide text-destructive">
                Ticket already used — entry denied
              </p>
            ) : (
              <>
                <p className="mt-3 font-mono text-xs font-semibold tracking-widest">{code}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Rotates in {left}s · screenshots are not accepted
                </p>
              </>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <DataPair label="Holder" value={ticket.holder} />
            <DataPair label="CNIC" value="37405-•••••••-3" />
            <DataPair label="Enclosure" value={ticket.categoryName} />
            <DataPair label="Paid" value={currency(ticket.price + ticket.fee)} />
          </div>
        </div>
      </div>

      <Card className={cn("mt-3", ticket.downloaded ? "border-success/40 bg-success/8" : "border-gold/40 bg-gold/8")}>
        <p className="flex items-center gap-2 text-sm font-semibold">
          {ticket.downloaded ? <ShieldCheck className="h-4 w-4 text-success" /> : <WifiOff className="h-4 w-4" />}
          {ticket.downloaded ? "Stored offline on this device" : "Not saved for offline use yet"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {offline
            ? "You're offline — this pass was loaded from local storage."
            : "Match day networks get congested. Save the pass before you travel."}
        </p>
        <PrimaryButton className="mt-3" variant={ticket.downloaded ? "outline" : "gold"} onClick={() => go("matchPass", { beat: "drop" })}>
          {ticket.downloaded ? "Open Match Pass" : "Download Match Pass"}
        </PrimaryButton>
      </Card>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <PrimaryButton variant="ghost" onClick={() => go("wayfinding", { beat: "turn" })}>
          <MapPinned className="h-4 w-4" /> Find seat
        </PrimaryButton>
        <PrimaryButton variant="ghost" onClick={() => go("rules")}>
          <BookOpen className="h-4 w-4" /> Rules
        </PrimaryButton>
      </div>
      <div className="h-6" />
    </Screen>
  );
}

/* ── 7. Offline Match Pass ─────────────────────────────────── */

const PASS_ITEMS = [
  { id: "qr", label: "Encrypted ticket QR", size: "12 KB" },
  { id: "map", label: "Stadium map & block plan", size: "1.4 MB" },
  { id: "route", label: "Gate-to-seat route", size: "220 KB" },
  { id: "fac", label: "Facilities directory", size: "180 KB" },
  { id: "rules", label: "Rules & emergency info", size: "60 KB" },
];

export function MatchPassScreen() {
  const { back, go, ticket, downloadPass, offline, setOffline } = usePcb();
  const [step, setStep] = useState(ticket?.downloaded ? PASS_ITEMS.length : -1);
  const running = step >= 0 && step < PASS_ITEMS.length;
  const done = step >= PASS_ITEMS.length;

  const start = () => {
    setStep(0);
    PASS_ITEMS.forEach((_, i) => {
      setTimeout(() => {
        setStep(i + 1);
        if (i === PASS_ITEMS.length - 1) downloadPass();
      }, 420 * (i + 1));
    });
  };

  return (
    <Screen nav={false} className="pb-10">
      <TopBar title="Offline Match Pass" subtitle="Works with zero signal" onBack={back} right={<ConnectivityPill />} />

      <div className="rounded-3xl bg-pitch p-5 text-primary-foreground">
        <Chip tone="gold">{done ? "Ready offline" : "Not downloaded"}</Chip>
        <p className="mt-3 font-display text-xl font-extrabold">
          {done ? "Your Match Pass is on this device" : "Download once, enter without network"}
        </p>
        <p className="mt-1.5 text-xs text-white/60">
          Around 1.9 MB. Includes your QR, map, route, facilities and rules.
        </p>
      </div>

      <SectionTitle>Pass contents</SectionTitle>
      <Card className="p-2">
        {PASS_ITEMS.map((item, i) => {
          const complete = step > i;
          const active = step === i;
          return (
            <div key={item.id} className="flex items-center gap-3 border-b border-border/70 px-2 py-3 last:border-0">
              <span
                className={cn(
                  "grid h-8 w-8 shrink-0 place-items-center rounded-full transition",
                  complete ? "tick-in bg-success/15 text-success" : active ? "bg-gold/25 text-gold-foreground" : "bg-secondary text-muted-foreground",
                )}
              >
                {complete ? <Check className="h-4 w-4" strokeWidth={3} /> : <Download className="h-3.5 w-3.5" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">{item.label}</span>
                <span className="block text-[11px] text-muted-foreground">
                  {complete ? "Saved to device" : active ? "Downloading…" : item.size}
                </span>
              </span>
            </div>
          );
        })}
      </Card>

      {done ? (
        <>
          <Card className="mt-3 border-success/40 bg-success/8">
            <p className="flex items-center gap-2 text-sm font-semibold text-success">
              <ShieldCheck className="h-4 w-4" /> Match Pass ready
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try it: switch on Offline Mode and everything below still works.
            </p>
            <PrimaryButton
              className="mt-3"
              variant={offline ? "outline" : "gold"}
              onClick={() => setOffline(!offline)}
            >
              <WifiOff className="h-4 w-4" /> {offline ? "Turn off Offline Mode" : "Simulate Offline Mode"}
            </PrimaryButton>
          </Card>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <PrimaryButton variant="ghost" onClick={() => go("ticket", { beat: "flip" })}>Open ticket</PrimaryButton>
            <PrimaryButton variant="ghost" onClick={() => go("wayfinding", { beat: "turn" })}>Find my seat</PrimaryButton>
          </div>
        </>
      ) : (
        <PrimaryButton className="mt-4" disabled={running} onClick={start}>
          {running ? "Downloading…" : "Download Match Pass"}
        </PrimaryButton>
      )}
      <div className="h-6" />
    </Screen>
  );
}

/* ── 8. My tickets ─────────────────────────────────────────── */

export function MyTicketsScreen() {
  const { go, ticket } = usePcb();
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const m = ticket ? getMatch(ticket.matchId) : null;

  return (
    <Screen>
      <TopBar title="My Tickets" subtitle={HOLDER_NAME} right={<ConnectivityPill />} />

      <div className="mb-4 grid grid-cols-2 gap-2 rounded-2xl bg-secondary p-1">
        {(["upcoming", "past"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-xl py-2 text-xs font-bold capitalize transition",
              tab === t ? "bg-surface text-foreground shadow-sm" : "text-muted-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "upcoming" ? (
        ticket && m ? (
          <Card onClick={() => go("ticket", { beat: "flip" })} className="border-gold/40">
            <div className="flex items-center justify-between gap-3">
              <Chip tone="gold">{m.type}</Chip>
              <Chip tone={ticket.status === "USED" ? "red" : ticket.status === "SCANNED" ? "amber" : "green"}>
                {ticket.status}
              </Chip>
            </div>
            <p className="mt-2.5 font-display text-sm font-bold">{m.home.name} v {m.away.name}</p>
            <p className="text-xs text-muted-foreground">{m.venue} · {m.dateLabel} · {m.timeLabel}</p>
            <div className="mt-3 grid grid-cols-4 gap-2 border-t border-border pt-3">
              <DataPair label="Gate" value={ticket.gate.replace("Gate ", "")} />
              <DataPair label="Block" value={ticket.block} />
              <DataPair label="Row" value={ticket.row} />
              <DataPair label="Seat" value={ticket.seat} />
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-primary">
              {ticket.downloaded ? "Available offline" : "Tap to download Match Pass"} <ChevronRight className="h-3 w-3" />
            </p>
          </Card>
        ) : (
          <Card>
            <p className="text-sm font-semibold">No upcoming tickets</p>
            <p className="mt-1 text-xs text-muted-foreground">Book a match to see your ticket here.</p>
            <PrimaryButton className="mt-3" onClick={() => go("matches")}>Browse matches</PrimaryButton>
          </Card>
        )
      ) : (
        <div className="space-y-3">
          {PAST_TICKETS.map((p) => (
            <Card key={p.id}>
              <div className="flex items-center justify-between gap-3">
                <Chip>{p.type}</Chip>
                <Chip tone="muted">{p.status}</Chip>
              </div>
              <p className="mt-2.5 font-display text-sm font-bold">{p.match}</p>
              <p className="text-xs text-muted-foreground">{p.venue} · {p.date}</p>
              <p className="mt-2 border-t border-border pt-2 text-[11px] text-muted-foreground">
                {p.seat} · {p.id}
              </p>
            </Card>
          ))}
        </div>
      )}
    </Screen>
  );
}
