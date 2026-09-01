import { useEffect, useState } from "react";
import {
  Bell,
  ChevronRight,
  MapPin,
  CalendarDays,
  Clock,
  Ticket as TicketIcon,
  BookOpen,
  ShieldCheck,
  Trophy,
  Download,
  DoorOpen,
  Armchair,
  LifeBuoy,
  Sparkles,
} from "lucide-react";
import stadiumAerial from "@/assets/stadium-aerial.jpg.asset.json";
import spectators from "@/assets/spectators.jpg.asset.json";
import {
  ANNOUNCEMENTS,
  MATCHES,
  currency,
  getMatch,
  CATEGORIES,
  FEATURED_MATCH_ID,
} from "@/lib/pcb-data";
import { usePcb } from "@/lib/pcb-store";
import { Card, Chip, ConnectivityPill, DataPair, PrimaryButton, Screen, SectionTitle, TopBar } from "../kit";
import { cn } from "@/lib/utils";

export function useCountdown(iso: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, new Date(iso).getTime() - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return { d, h, m, s };
}

function CountdownStrip({ iso }: { iso: string }) {
  const { d, h, m, s } = useCountdown(iso);
  const items = [
    { v: d, l: "Days" },
    { v: h, l: "Hrs" },
    { v: m, l: "Min" },
    { v: s, l: "Sec" },
  ];
  return (
    <div className="grid grid-cols-4 gap-2">
      {items.map((i) => (
        <div key={i.l} className="rounded-xl bg-white/10 py-2 text-center backdrop-blur">
          <p className="font-display text-lg font-extrabold tabular-nums text-white">
            {String(i.v).padStart(2, "0")}
          </p>
          <p className="text-[9px] font-semibold uppercase tracking-wider text-white/55">{i.l}</p>
        </div>
      ))}
    </div>
  );
}

export function HomeScreen() {
  const { go, ticket, fanPoints, offline } = usePcb();
  const match = getMatch(FEATURED_MATCH_ID);

  return (
    <Screen pad={false}>
      <div className="px-5 pt-14">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-pitch font-display text-sm font-bold text-primary-foreground">
            AA
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">Assalam-u-Alaikum</p>
            <p className="truncate font-display text-[17px] font-bold">Abdullah</p>
          </div>
          <ConnectivityPill />
          <button
            onClick={() => go("notifications")}
            className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary transition active:scale-95"
          >
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-gold ring-2 ring-background" />
          </button>
        </div>
      </div>

      {/* Hero next match */}
      <div className="px-5 pt-5">
        <div className="relative overflow-hidden rounded-3xl bg-pitch">
          <img
            src={stadiumAerial.url}
            alt="Aerial view of Rawalpindi Cricket Stadium"
            width={1080}
            height={1350}
            className="absolute inset-0 h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-pitch/50 via-pitch/80 to-pitch" />
          <div className="relative p-5">
            <div className="flex items-center justify-between">
              <Chip tone="gold">Next Pakistan Match</Chip>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-white/60">
                {match.type}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <TeamBadge flag={match.home.flag} name={match.home.name} />
              <span className="font-display text-xs font-bold text-white/50">VS</span>
              <TeamBadge flag={match.away.flag} name={match.away.name} align="right" />
            </div>

            <div className="mt-4 space-y-1.5 text-[12px] text-white/75">
              <p className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-gold" /> {match.venue}, {match.city}
              </p>
              <p className="flex items-center gap-2">
                <CalendarDays className="h-3.5 w-3.5 text-gold" /> {match.dateLabel} · {match.timeLabel} PKT
              </p>
            </div>

            <div className="mt-4">
              <CountdownStrip iso={match.dateISO} />
            </div>

            <div className="mt-4 flex gap-2">
              <PrimaryButton
                variant="gold"
                onClick={() => go("matchDetail", { params: { id: match.id }, beat: "flip" })}
              >
                <TicketIcon className="h-4 w-4" /> Get Tickets
              </PrimaryButton>
              <button
                onClick={() => go("matchDetail", { params: { id: match.id }, beat: "flip" })}
                className="grid h-13 w-13 shrink-0 place-items-center rounded-2xl bg-white/10 px-4 text-white transition active:scale-95"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5">
        {ticket && (
          <>
            <SectionTitle>Your Match Day</SectionTitle>
            <Card
              onClick={() => go("matchDay", { beat: "flip" })}
              className="border-gold/40 bg-gold/8"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-pitch text-primary-foreground">
                  <TicketIcon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-sm font-bold">
                    {ticket.gate} · Block {ticket.block} · Row {ticket.row} · Seat {ticket.seat}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {ticket.downloaded ? "Match Pass ready offline" : "Download your Match Pass"}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </div>
            </Card>
          </>
        )}

        <SectionTitle>Quick links</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          <QuickLink icon={<TicketIcon className="h-5 w-5" />} title="My Tickets" sub={ticket ? "1 upcoming" : "None yet"} onClick={() => go("myTickets")} />
          <QuickLink icon={<BookOpen className="h-5 w-5" />} title="Match Day Guide" sub="Know before you go" onClick={() => go("rules")} />
          <QuickLink icon={<Trophy className="h-5 w-5" />} title="Fan Zone" sub={`${fanPoints.toLocaleString()} points`} onClick={() => go("engage")} />
          <QuickLink icon={<ShieldCheck className="h-5 w-5" />} title="Stadium Map" sub={offline ? "Available offline" : "Rawalpindi"} onClick={() => go("stadium")} />
        </div>

        <SectionTitle action={<button onClick={() => go("matches")} className="text-xs font-semibold text-primary">See all</button>}>
          Upcoming matches
        </SectionTitle>
        <div className="space-y-3">
          {MATCHES.slice(1, 4).map((m) => (
            <MatchRow key={m.id} id={m.id} />
          ))}
        </div>

        <SectionTitle>PCB announcements</SectionTitle>
        <div className="space-y-3">
          {ANNOUNCEMENTS.map((a) => (
            <Card key={a.id}>
              <div className="flex items-start gap-3">
                <img
                  src={spectators.url}
                  alt=""
                  loading="lazy"
                  width={736}
                  height={981}
                  className="h-14 w-14 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Chip>{a.tag}</Chip>
                    <span className="text-[10px] text-muted-foreground">{a.time}</span>
                  </div>
                  <p className="mt-1.5 text-sm font-semibold leading-snug">{a.title}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{a.body}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div className="h-4" />
      </div>
    </Screen>
  );
}

function TeamBadge({ flag, name, align = "left" }: { flag: string; name: string; align?: "left" | "right" }) {
  return (
    <div className={cn("flex min-w-0 flex-1 items-center gap-2", align === "right" && "flex-row-reverse text-right")}>
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/12 text-xl">{flag}</span>
      <p className="truncate font-display text-[15px] font-bold text-white">{name}</p>
    </div>
  );
}

function QuickLink({ icon, title, sub, onClick }: { icon: React.ReactNode; title: string; sub: string; onClick: () => void }) {
  return (
    <Card onClick={onClick} className="p-3.5">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-secondary text-primary">{icon}</span>
      <p className="mt-2.5 font-display text-[13px] font-bold">{title}</p>
      <p className="text-[11px] text-muted-foreground">{sub}</p>
    </Card>
  );
}

function MatchRow({ id }: { id: string }) {
  const { go } = usePcb();
  const m = getMatch(id);
  const tone = m.availability === "Sold Out" ? "red" : m.availability === "Limited" ? "amber" : "green";
  return (
    <Card onClick={() => go("matchDetail", { params: { id }, beat: "flip" })}>
      <div className="flex items-center gap-3">
        <div className="w-11 shrink-0 rounded-xl bg-secondary py-1.5 text-center">
          <p className="font-display text-base font-extrabold leading-none">{m.dateLabel.split(" ")[0]}</p>
          <p className="text-[10px] font-semibold uppercase text-muted-foreground">{m.dateLabel.split(" ")[1]}</p>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-sm font-bold">
            {m.home.short} v {m.away.short}
            <span className="ml-1.5 text-[10px] font-semibold text-muted-foreground">{m.type}</span>
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {m.venue} · {m.timeLabel}
          </p>
        </div>
        <Chip tone={tone}>{m.availability}</Chip>
      </div>
    </Card>
  );
}

export function MatchesScreen() {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "T20I", "ODI", "Test"];
  const list = MATCHES.filter((m) => filter === "All" || m.type === filter);
  return (
    <Screen>
      <TopBar title="Matches" subtitle="International fixtures in Pakistan" right={<ConnectivityPill />} />
      <div className="no-scrollbar -mx-5 mb-4 flex gap-2 overflow-x-auto px-5">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-xs font-bold transition active:scale-95",
              filter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground",
            )}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {Object.entries(
          list.reduce<Record<string, typeof MATCHES>>((acc, m) => {
            (acc[m.series] ??= []).push(m);
            return acc;
          }, {}),
        ).map(([series, ms]) => (
          <div key={series}>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{series}</p>
            <div className="space-y-3">
              {ms.map((m) => (
                <MatchRow key={m.id} id={m.id} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Screen>
  );
}

export function MatchDetailScreen() {
  const { screen, go, back } = usePcb();
  const m = getMatch(screen.params?.["id"] ?? FEATURED_MATCH_ID);
  const soldOut = m.availability === "Sold Out";

  return (
    <>
      <Screen pad={false} nav={false} className="pb-28">
        <div className="relative h-64">
          <img
            src={stadiumAerial.url}
            alt={`${m.venue} from above`}
            width={1080}
            height={1350}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-pitch/60" />
          <button
            onClick={back}
            className="absolute left-5 top-14 grid h-10 w-10 place-items-center rounded-full bg-black/40 text-white backdrop-blur transition active:scale-95"
          >
            <ChevronRight className="h-5 w-5 rotate-180" />
          </button>
          <div className="absolute inset-x-5 bottom-4">
            <Chip tone="gold">{m.series}</Chip>
            <h1 className="mt-2 font-display text-2xl font-extrabold leading-tight">
              {m.home.name} v {m.away.name}
            </h1>
          </div>
        </div>

        <div className="px-5">
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Card className="p-3.5">
              <DataPair label="Date" value={m.dateLabel} />
            </Card>
            <Card className="p-3.5">
              <DataPair label="Start" value={`${m.timeLabel} PKT`} />
            </Card>
            <Card className="p-3.5">
              <DataPair label="Match type" value={m.type} />
            </Card>
            <Card className="p-3.5">
              <DataPair label="Availability" value={m.availability} />
            </Card>
          </div>

          <SectionTitle>Venue</SectionTitle>
          <Card>
            <p className="font-display text-sm font-bold">{m.venue}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {m.city} · Capacity 28,000 · Floodlit · 4 public gates
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {["Prayer area", "Medical posts", "Accessible seating", "Family enclosure"].map((f) => (
                <Chip key={f}>{f}</Chip>
              ))}
            </div>
          </Card>

          <SectionTitle>Ticket categories</SectionTitle>
          <div className="space-y-3">
            {CATEGORIES.map((c) => (
              <Card key={c.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-display text-sm font-bold">{c.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{c.desc}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Blocks {c.blocks.join(", ")} · {c.left.toLocaleString()} left
                    </p>
                  </div>
                  <p className="shrink-0 font-display text-sm font-extrabold text-primary">{currency(c.price)}</p>
                </div>
              </Card>
            ))}
          </div>

          <SectionTitle>Stadium information</SectionTitle>
          <Card>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex gap-2"><Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" /> Gates open 3 hours before the first ball.</li>
              <li className="flex gap-2"><DoorOpen className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" /> Your gate is printed on your Match Pass — entry is gate-specific.</li>
              <li className="flex gap-2"><ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" /> Original CNIC required alongside the digital pass.</li>
            </ul>
          </Card>
          <div className="h-6" />
        </div>
      </Screen>
      <div className="absolute inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 px-5 pb-8 pt-3 backdrop-blur-xl">
        <PrimaryButton
          disabled={soldOut}
          onClick={() => go("buyCategory", { params: { id: m.id }, beat: "flip" })}
        >
          {soldOut ? "Sold Out" : "Buy Ticket"}
        </PrimaryButton>
      </div>
    </>
  );
}

export function MatchDayScreen() {
  const { go, ticket, offline } = usePcb();
  const m = getMatch(FEATURED_MATCH_ID);
  const { d, h, m: mm } = useCountdown(m.dateISO);

  const actions = [
    { label: "Open Ticket", Icon: TicketIcon, to: "ticket" as const, beat: "flip" as const },
    { label: "Find My Gate", Icon: DoorOpen, to: "wayfinding" as const, beat: "turn" as const },
    { label: "Find My Seat", Icon: Armchair, to: "wayfinding" as const, beat: "turn" as const },
    { label: "Facilities", Icon: Sparkles, to: "facilities" as const, beat: null },
    { label: "Stadium Rules", Icon: BookOpen, to: "rules" as const, beat: null },
    { label: "Help", Icon: LifeBuoy, to: "profile" as const, beat: null },
  ];

  return (
    <Screen>
      <TopBar title="Match Day" subtitle={`${m.home.short} v ${m.away.short} · ${m.venue}`} right={<ConnectivityPill />} />

      <div className="rounded-3xl bg-pitch p-5 text-primary-foreground">
        <div className="flex items-center justify-between">
          <Chip tone="gold">{offline ? "Offline Mode" : "Live status"}</Chip>
          <span className="text-[11px] text-white/60">{m.dateLabel} · {m.timeLabel}</span>
        </div>
        <p className="mt-3 font-display text-xl font-extrabold">
          Starts in {d}d {h}h {mm}m
        </p>
        <p className="mt-1 text-xs text-white/60">Gates open 3 hours before the first ball.</p>
      </div>

      {ticket ? (
        <Card className="mt-4">
          <div className="grid grid-cols-4 gap-2">
            <DataPair label="Gate" value={ticket.gate.replace("Gate ", "")} />
            <DataPair label="Block" value={ticket.block} />
            <DataPair label="Row" value={ticket.row} />
            <DataPair label="Seat" value={ticket.seat} />
          </div>
          <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
            <Chip tone={ticket.status === "USED" ? "red" : ticket.status === "SCANNED" ? "amber" : "green"}>
              {ticket.status}
            </Chip>
            {ticket.downloaded ? (
              <Chip tone="gold">Available offline</Chip>
            ) : (
              <button onClick={() => go("matchPass", { beat: "drop" })} className="text-xs font-semibold text-primary">
                Download Match Pass →
              </button>
            )}
          </div>
        </Card>
      ) : (
        <Card className="mt-4">
          <p className="text-sm font-semibold">No ticket yet</p>
          <p className="mt-1 text-xs text-muted-foreground">Buy a ticket to unlock your personalised match day.</p>
          <PrimaryButton className="mt-3" onClick={() => go("matchDetail", { params: { id: m.id }, beat: "flip" })}>
            Get Tickets
          </PrimaryButton>
        </Card>
      )}

      <SectionTitle>Quick actions</SectionTitle>
      <div className="grid grid-cols-3 gap-3">
        {actions.map(({ label, Icon, to, beat }) => (
          <button
            key={label}
            onClick={() => go(to, beat ? { beat } : undefined)}
            className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface p-3 text-center transition active:scale-95"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-primary">
              <Icon className="h-[18px] w-[18px]" />
            </span>
            <span className="text-[11px] font-semibold leading-tight">{label}</span>
          </button>
        ))}
      </div>

      {offline && (
        <Card className="mt-4 border-warning/40 bg-warning/8">
          <p className="flex items-center gap-2 text-sm font-semibold text-warning">
            <Download className="h-4 w-4" /> Offline Mode active
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Your ticket, stadium map, seat route, facilities and rules are all stored on this device.
          </p>
        </Card>
      )}
    </Screen>
  );
}

export function NotificationsScreen() {
  const { back, ticket, go } = usePcb();
  const items = [
    { t: "Your match is tomorrow", b: "Pakistan v England, Rawalpindi Cricket Stadium, 4:30 PM.", time: "Now", gold: true },
    ...(ticket?.downloaded
      ? [{ t: "Ticket ready for offline use", b: "Your Match Pass is stored on this device and works without network.", time: "5m", gold: false }]
      : [{ t: "Download your Match Pass before leaving", b: "Network around the stadium gets congested on match day.", time: "5m", gold: false }]),
    { t: `${ticket?.gate ?? "Gate 3"} is your assigned entrance`, b: "Entry is gate-specific. Allow 30 minutes for screening.", time: "1h", gold: false },
  ];
  return (
    <Screen>
      <TopBar title="Notifications" onBack={back} right={<ConnectivityPill />} />
      <div className="space-y-3">
        {items.map((n) => (
          <Card key={n.t} onClick={() => go("matchDay")} className={n.gold ? "border-gold/40 bg-gold/8" : undefined}>
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-semibold leading-snug">{n.t}</p>
              <span className="shrink-0 text-[10px] text-muted-foreground">{n.time}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{n.b}</p>
          </Card>
        ))}
      </div>
    </Screen>
  );
}
