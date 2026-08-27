import { cn } from "@/lib/utils"

export function RadarSweep({ className, size = 20 }: { className?: string; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={cn("shrink-0", className)}
    >
      <circle cx="20" cy="20" r="18" className="fill-none stroke-current opacity-20" strokeWidth="1.5" />
      <circle cx="20" cy="20" r="11" className="fill-none stroke-current opacity-30" strokeWidth="1" />
      <circle cx="20" cy="20" r="1.6" className="fill-current" />
      <g className="radar-sweep-spin" style={{ transformOrigin: "20px 20px" }}>
        <path d="M20 20 L20 2 A18 18 0 0 1 34 11 Z" className="fill-current opacity-40" />
      </g>
    </svg>
  )
}
