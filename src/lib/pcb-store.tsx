import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { FEATURED_MATCH_ID, HOLDER_NAME, SERVICE_FEE } from "./pcb-data";

export type Beat = "flip" | "lean" | "drop" | "turn" | "shake" | "pulse" | null;

export type ScreenName =
  | "home"
  | "matches"
  | "matchDetail"
  | "buyCategory"
  | "seatMap"
  | "seatDetail"
  | "summary"
  | "confirmation"
  | "ticket"
  | "matchPass"
  | "myTickets"
  | "stadium"
  | "wayfinding"
  | "facilities"
  | "rules"
  | "matchDay"
  | "profile"
  | "settings"
  | "engage"
  | "notifications"
  | "admin";

export interface Screen {
  name: ScreenName;
  params?: Record<string, string> | undefined;
}

export type TicketStatus = "VALID" | "SCANNED" | "USED";

export interface Ticket {
  id: string;
  matchId: string;
  holder: string;
  categoryId: string;
  categoryName: string;
  block: string;
  row: number;
  seat: number;
  gate: string;
  price: number;
  fee: number;
  status: TicketStatus;
  downloaded: boolean;
  purchasedAt: string;
}

interface Draft {
  categoryId?: string;
  block?: string;
  row?: number;
  seat?: number;
  gate?: string;
  price?: number;
}

interface Store {
  screen: Screen;
  stack: Screen[];
  go: (name: ScreenName, opts?: { params?: Record<string, string>; beat?: Beat }) => void;
  back: () => void;
  beat: Beat;
  fire: (b: Beat) => void;
  offline: boolean;
  setOffline: (v: boolean) => void;
  ticket: Ticket | null;
  draft: Draft;
  setDraft: (d: Draft) => void;
  purchase: (matchId: string) => Ticket;
  downloadPass: () => void;
  scanTicket: () => "ok" | "reused";
  resetTicket: () => void;
  fanPoints: number;
  addPoints: (n: number) => void;
  answered: Record<string, string>;
  answer: (id: string, value: string) => void;
  matchId: string;
}

const Ctx = createContext<Store | null>(null);

export function PcbProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<Screen[]>([{ name: "home" }]);
  const [beat, setBeat] = useState<Beat>(null);
  const [offline, setOffline] = useState(false);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [draft, setDraft] = useState<Draft>({});
  const [fanPoints, setFanPoints] = useState(1250);
  const [answered, setAnswered] = useState<Record<string, string>>({});
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fire = useCallback((b: Beat) => {
    if (!b) return;
    if (timer.current) clearTimeout(timer.current);
    setBeat(null);
    requestAnimationFrame(() => setBeat(b));
    timer.current = setTimeout(() => setBeat(null), 900);
  }, []);

  const go = useCallback<Store["go"]>(
    (name, opts) => {
      if (opts?.beat) fire(opts.beat);
      setStack((s) => [...s, { name, params: opts?.params } as Screen]);
    },
    [fire],
  );

  const back = useCallback(() => {
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  }, []);

  const purchase = useCallback(
    (matchId: string) => {
      const t: Ticket = {
        id: `PCB-2026-${Math.floor(100000 + Math.random() * 899999)}`,
        matchId,
        holder: HOLDER_NAME,
        categoryId: draft.categoryId ?? "first",
        categoryName: "First Class Enclosure",
        block: draft.block ?? "B",
        row: draft.row ?? 12,
        seat: draft.seat ?? 18,
        gate: draft.gate ?? "Gate 3",
        price: draft.price ?? 6500,
        fee: SERVICE_FEE,
        status: "VALID",
        downloaded: false,
        purchasedAt: new Date().toISOString(),
      };
      setTicket(t);
      return t;
    },
    [draft],
  );

  const downloadPass = useCallback(
    () => setTicket((t) => (t ? { ...t, downloaded: true } : t)),
    [],
  );

  const scanTicket = useCallback<Store["scanTicket"]>(() => {
    let result: "ok" | "reused" = "ok";
    setTicket((t) => {
      if (!t) return t;
      if (t.status === "USED") {
        result = "reused";
        return t;
      }
      return { ...t, status: t.status === "VALID" ? "SCANNED" : "USED" };
    });
    return result;
  }, []);

  const value = useMemo<Store>(
    () => ({
      screen: stack[stack.length - 1]!,
      stack,
      go,
      back,
      beat,
      fire,
      offline,
      setOffline,
      ticket,
      draft,
      setDraft: (d) => setDraft((prev) => ({ ...prev, ...d })),
      purchase,
      downloadPass,
      scanTicket,
      resetTicket: () => setTicket(null),
      fanPoints,
      addPoints: (n) => setFanPoints((p) => p + n),
      answered,
      answer: (id, v) => setAnswered((a) => ({ ...a, [id]: v })),
      matchId: FEATURED_MATCH_ID,
    }),
    [stack, go, back, beat, fire, offline, ticket, draft, purchase, downloadPass, scanTicket, fanPoints, answered],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePcb() {
  const c = useContext(Ctx);
  if (!c) throw new Error("usePcb must be used inside PcbProvider");
  return c;
}

/** Live status of the ticket QR — rotates every 30s (simulated anti-fraud). */
export function useRotatingCode(active: boolean) {
  const [code, setCode] = useState(() => randomCode());
  const [left, setLeft] = useState(30);
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => {
      setLeft((l) => {
        if (l <= 1) {
          setCode(randomCode());
          return 30;
        }
        return l - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [active]);
  return { code, left };
}

function randomCode() {
  return Array.from({ length: 4 }, () =>
    Math.random().toString(36).slice(2, 6).toUpperCase(),
  ).join("-");
}
