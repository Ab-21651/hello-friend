import type { ReactNode } from "react";
import { usePcb } from "@/lib/pcb-store";
import { cn } from "@/lib/utils";

const beatClass: Record<string, string> = {
  flip: "beat-flip",
  lean: "beat-lean",
  drop: "beat-drop",
  turn: "beat-turn",
  shake: "beat-shake",
  pulse: "beat-pulse",
};

export function PhoneFrame({ children }: { children: ReactNode }) {
  const { beat, offline } = usePcb();

  return (
    <div className="relative" style={{ perspective: "1600px" }}>
      {/* glow */}
      <div
        aria-hidden
        className="absolute -inset-10 rounded-[4rem] bg-primary/25 blur-3xl"
      />
      <div
        className={cn(
          "relative h-[844px] w-[390px] rounded-[3.2rem] border-[3px] border-neutral-700 bg-neutral-900 p-[10px] shadow-[0_40px_90px_-20px_rgba(0,0,0,0.65)]",
          beat && beatClass[beat],
        )}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* side buttons */}
        <span className="absolute -left-[5px] top-[130px] h-8 w-[4px] rounded-l bg-neutral-700" />
        <span className="absolute -left-[5px] top-[186px] h-14 w-[4px] rounded-l bg-neutral-700" />
        <span className="absolute -left-[5px] top-[256px] h-14 w-[4px] rounded-l bg-neutral-700" />
        <span className="absolute -right-[5px] top-[216px] h-20 w-[4px] rounded-r bg-neutral-700" />

        <div className="relative h-full w-full overflow-hidden rounded-[2.6rem] bg-background">
          {/* status bar */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-50 flex h-12 items-center justify-between px-7 text-[11px] font-semibold text-foreground/80 mix-blend-luminosity">
            <span>16:09</span>
            <span className="flex items-center gap-1.5">
              {offline ? (
                <span className="rounded-full bg-warning/90 px-1.5 py-[1px] text-[9px] font-bold text-neutral-900">
                  OFFLINE
                </span>
              ) : null}
              <SignalIcon />
              <BatteryIcon />
            </span>
          </div>
          {/* dynamic island */}
          <div className="absolute left-1/2 top-2.5 z-50 h-[30px] w-[112px] -translate-x-1/2 rounded-full bg-black" />
          <div className="absolute right-[145px] top-[17px] z-50 h-2 w-2 rounded-full bg-neutral-800 ring-1 ring-neutral-700" />

          {children}

          {/* home indicator */}
          <div className="pointer-events-none absolute bottom-1.5 left-1/2 z-50 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-foreground/25" />
        </div>
      </div>
    </div>
  );
}

function SignalIcon() {
  return (
    <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
      <rect x="0" y="7" width="3" height="4" rx="1" />
      <rect x="4.6" y="5" width="3" height="6" rx="1" />
      <rect x="9.2" y="2.5" width="3" height="8.5" rx="1" />
      <rect x="13.8" y="0" width="3" height="11" rx="1" opacity="0.4" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg width="24" height="11" viewBox="0 0 24 11" fill="none">
      <rect x="0.5" y="0.5" width="20" height="10" rx="3" stroke="currentColor" opacity="0.5" />
      <rect x="2" y="2" width="14" height="7" rx="1.6" fill="currentColor" />
      <path d="M22 4v3a2 2 0 000-3z" fill="currentColor" opacity="0.5" />
    </svg>
  );
}
