import type { ReactNode } from "react";
import { ChevronLeft, Wifi, WifiOff } from "lucide-react";
import { usePcb } from "@/lib/pcb-store";
import { cn } from "@/lib/utils";

/** Scrollable screen body with top/bottom safe areas. */
export function Screen({
  children,
  className,
  pad = true,
  nav = true,
}: {
  children: ReactNode;
  className?: string;
  pad?: boolean;
  nav?: boolean;
}) {
  return (
    <div
      className={cn(
        "screen-in no-scrollbar h-full overflow-y-auto overscroll-contain",
        nav ? "pb-24" : "pb-8",
        pad && "px-5",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function TopBar({
  title,
  subtitle,
  onBack,
  right,
  tone = "light",
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <div
      className={cn(
        "sticky top-0 z-30 -mx-5 mb-4 flex items-center gap-3 px-5 pb-3 pt-14 backdrop-blur-xl",
        tone === "light"
          ? "bg-background/85 text-foreground"
          : "bg-pitch/90 text-primary-foreground",
      )}
    >
      {onBack && (
        <button
          onClick={onBack}
          aria-label="Back"
          className={cn(
            "grid h-10 w-10 shrink-0 place-items-center rounded-full transition active:scale-95",
            tone === "light" ? "bg-secondary" : "bg-white/10",
          )}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      <div className="min-w-0 flex-1">
        <h1 className="truncate font-display text-lg font-700 leading-tight" style={{ fontWeight: 700 }}>
          {title}
        </h1>
        {subtitle && (
          <p className={cn("truncate text-xs", tone === "light" ? "text-muted-foreground" : "text-white/60")}>
            {subtitle}
          </p>
        )}
      </div>
      {right}
    </div>
  );
}

export function ConnectivityPill({ className }: { className?: string }) {
  const { offline, go } = usePcb();
  return (
    <button
      onClick={() => go("settings")}
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide transition active:scale-95",
        offline ? "bg-warning/20 text-warning" : "bg-success/15 text-success",
        className,
      )}
    >
      {offline ? <WifiOff className="h-3 w-3" /> : <Wifi className="h-3 w-3" />}
      {offline ? "Offline Mode" : "Online"}
    </button>
  );
}

export function Card({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string | undefined;
  onClick?: (() => void) | undefined;
}) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      className={cn(
        "w-full rounded-2xl border border-border bg-surface p-4 text-left shadow-[0_1px_2px_rgba(16,40,30,0.04)]",
        onClick && "transition active:scale-[0.985]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-3 mt-6 flex items-center justify-between gap-3">
      <h2 className="font-display text-[15px] font-bold">{children}</h2>
      {action}
    </div>
  );
}

export function Chip({
  children,
  tone = "muted",
  className,
}: {
  children: ReactNode;
  tone?: "muted" | "gold" | "green" | "red" | "amber";
  className?: string;
}) {
  const tones = {
    muted: "bg-secondary text-secondary-foreground",
    gold: "bg-gold/20 text-gold-foreground",
    green: "bg-success/15 text-success",
    red: "bg-destructive/12 text-destructive",
    amber: "bg-warning/18 text-warning",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function PrimaryButton({
  children,
  onClick,
  className,
  variant = "solid",
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "solid" | "gold" | "outline" | "ghost" | "danger";
  disabled?: boolean;
}) {
  const variants = {
    solid: "bg-primary text-primary-foreground",
    gold: "bg-gold text-gold-foreground",
    outline: "border border-border bg-surface text-foreground",
    ghost: "bg-secondary text-secondary-foreground",
    danger: "bg-destructive text-destructive-foreground",
  };
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex h-13 w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 font-display text-[15px] font-bold transition active:scale-[0.98] disabled:opacity-40",
        variants[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}

export function StickyFooter({ children }: { children: ReactNode }) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 px-5 pb-8 pt-3 backdrop-blur-xl">
      {children}
    </div>
  );
}

export function Row({
  icon,
  label,
  value,
  onClick,
}: {
  icon?: ReactNode;
  label: string;
  value?: ReactNode;
  onClick?: () => void;
}) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      className="flex w-full items-center gap-3 border-b border-border/70 py-3.5 text-left last:border-0"
    >
      {icon && <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-secondary text-primary">{icon}</span>}
      <span className="min-w-0 flex-1 truncate text-sm font-medium">{label}</span>
      <span className="shrink-0 text-sm text-muted-foreground">{value}</span>
    </Tag>
  );
}

export function DataPair({ label, value, className }: { label: string; value: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-display text-sm font-bold">{value}</p>
    </div>
  );
}
