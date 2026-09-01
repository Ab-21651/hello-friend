import { cn } from "@/lib/utils";

/** Deterministic fake QR matrix rendered from a code string. */
export function QrBlock({ code, size = 176, className }: { code: string; size?: number; className?: string }) {
  const n = 25;
  let seed = 0;
  for (let i = 0; i < code.length; i++) seed = (seed * 31 + code.charCodeAt(i)) % 100003;
  const cells: boolean[] = [];
  let s = seed || 7;
  for (let i = 0; i < n * n; i++) {
    s = (s * 1103515245 + 12345) % 2147483648;
    cells.push((s >> 16) % 100 > 48);
  }
  const isFinder = (r: number, c: number) => {
    const inBox = (r0: number, c0: number) => r >= r0 && r < r0 + 7 && c >= c0 && c < c0 + 7;
    return inBox(0, 0) || inBox(0, n - 7) || inBox(n - 7, 0);
  };
  const finderOn = (r: number, c: number) => {
    const rr = r < 7 ? r : r - (n - 7);
    const cc = c < 7 ? c : c - (n - 7);
    const ring = Math.max(Math.abs(rr - 3), Math.abs(cc - 3));
    return ring === 3 || ring <= 1;
  };

  return (
    <svg
      key={code}
      width={size}
      height={size}
      viewBox={`0 0 ${n} ${n}`}
      role="img"
      aria-label={`Ticket QR code ${code}`}
      className={cn("qr-shift rounded-lg", className)}
      shapeRendering="crispEdges"
    >
      <rect width={n} height={n} fill="white" />
      {Array.from({ length: n * n }).map((_, i) => {
        const r = Math.floor(i / n);
        const c = i % n;
        const on = isFinder(r, c) ? finderOn(r, c) : cells[i];
        if (!on) return null;
        return <rect key={i} x={c} y={r} width={1} height={1} fill="currentColor" />;
      })}
    </svg>
  );
}
