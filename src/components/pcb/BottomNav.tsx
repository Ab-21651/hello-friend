import { Home, CalendarDays, Ticket as TicketIcon, MapPinned, User } from "lucide-react";
import { usePcb, type ScreenName } from "@/lib/pcb-store";
import { cn } from "@/lib/utils";

const TABS: { name: ScreenName; label: string; Icon: typeof Home }[] = [
  { name: "home", label: "Home", Icon: Home },
  { name: "matches", label: "Matches", Icon: CalendarDays },
  { name: "myTickets", label: "Tickets", Icon: TicketIcon },
  { name: "stadium", label: "Stadium", Icon: MapPinned },
  { name: "profile", label: "Profile", Icon: User },
];

export function BottomNav() {
  const { screen, go, ticket } = usePcb();
  return (
    <nav className="absolute inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 px-2 pb-6 pt-2 backdrop-blur-xl">
      <ul className="grid grid-cols-5">
        {TABS.map(({ name, label, Icon }) => {
          const active = screen.name === name;
          return (
            <li key={name}>
              <button
                onClick={() => go(name)}
                className="relative flex w-full flex-col items-center gap-1 rounded-xl py-1.5 transition active:scale-95"
              >
                <span className="relative">
                  <Icon
                    className={cn(
                      "h-[22px] w-[22px] transition-colors",
                      active ? "text-primary" : "text-muted-foreground",
                    )}
                    strokeWidth={active ? 2.4 : 1.8}
                  />
                  {name === "myTickets" && ticket && (
                    <span className="absolute -right-1.5 -top-1 h-2 w-2 rounded-full bg-gold ring-2 ring-surface" />
                  )}
                </span>
                <span
                  className={cn(
                    "text-[10px] font-semibold",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
