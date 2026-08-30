import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import {
  DETECTION_CORE,
  generateSimulatedAttackEvent,
  type SimOutcome,
  type SimulatedAttackEvent,
} from "@/mocks/attackSimulation"

const VIEW_W = 1000
const VIEW_H = 400
const LAT_TOP = 78
const LAT_BOTTOM = -58

function project(lat: number, lon: number): [number, number] {
  const x = ((lon + 180) / 360) * VIEW_W
  const y = ((LAT_TOP - lat) / (LAT_TOP - LAT_BOTTOM)) * VIEW_H
  return [x, y]
}

// Same coarse "is this coordinate land" bounding-box heuristic used for the earlier
// canvas threat map - no map/geo library in this project, and at this dot-grid
// resolution an exact coastline would be indistinguishable from this approximation.
const LAND_BOXES: Array<[number, number, number, number]> = [
  [60, 75, -168, -60],
  [45, 60, -140, -52],
  [30, 45, -125, -66],
  [14, 30, -118, -86],
  [7, 14, -92, -77],
  [18, 24, -85, -74],
  [-5, 7, -80, -50],
  [-20, -5, -78, -35],
  [-40, -20, -73, -53],
  [-55, -40, -73, -63],
  [36, 60, -9, 40],
  [60, 71, 5, 31],
  [30, 37, -10, 32],
  [0, 30, -17, 45],
  [-35, 0, 10, 42],
  [45, 78, 30, 180],
  [25, 45, 26, 145],
  [12, 32, 34, 60],
  [5, 25, 60, 140],
  [-10, 5, 95, 141],
  [-39, -10, 112, 154],
  [-47, -34, 166, 179],
]

function isLand(lat: number, lon: number): boolean {
  return LAND_BOXES.some(([latMin, latMax, lonMin, lonMax]) => lat >= latMin && lat <= latMax && lon >= lonMin && lon <= lonMax)
}

function useWorldDots() {
  return useMemo(() => {
    const dots: Array<[number, number]> = []
    const step = 4
    for (let lat = LAT_TOP; lat > LAT_BOTTOM; lat -= step) {
      for (let lon = -180; lon < 180; lon += step) {
        if (!isLand(lat, lon)) continue
        const [x, y] = project(lat + (Math.random() - 0.5) * 1.5, lon + (Math.random() - 0.5) * 1.5)
        dots.push([x, y])
      }
    }
    return dots
  }, [])
}

function bowedPath(x1: number, y1: number, x2: number, y2: number): string {
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  const dx = x2 - x1
  const dy = y2 - y1
  const dist = Math.hypot(dx, dy) || 1
  const bow = Math.min(dist * 0.25, 90)
  let px = -dy / dist
  let py = dx / dist
  if (py > 0) {
    px = -px
    py = -py
  }
  return `M ${x1} ${y1} Q ${mx + px * bow} ${my + py * bow} ${x2} ${y2}`
}

const OUTCOME_COLOR: Record<SimOutcome, string> = {
  BLOCK: "#f87171", // red-400 - matches the Recent Threats table's BLOCK badge
  HOLD: "#fbbf24", // amber-400 - matches HOLD
  ALLOW: "#a3e635", // lime-400 - matches ALLOW
}
const OUTCOME_LABEL: Record<SimOutcome, string> = { BLOCK: "Block", HOLD: "Hold / Verify", ALLOW: "Allow" }
const TRAVEL_COLOR = "#38bdf8" // cyan-400, "in transit" before the outcome is known

interface ActiveArc {
  id: string
  event: SimulatedAttackEvent
  path: string
  originX: number
  originY: number
}

const MAX_ACTIVE = 5
const DRAW_MS = 1300
const HOLD_MS = 900
const FADE_MS = 1300
const TOTAL_MS = DRAW_MS + HOLD_MS + FADE_MS
// Fractions of the total lifecycle where each keyframe lands, shared by every animated
// property on an arc so the draw -> hold -> recolor -> fade sequence stays in lockstep.
const KEYFRAME_TIMES = [0, DRAW_MS / TOTAL_MS, (DRAW_MS + HOLD_MS) / TOTAL_MS, 1]

export function AttackSimulationMap({ className = "" }: { className?: string }) {
  const dots = useWorldDots()
  const [arcs, setArcs] = useState<ActiveArc[]>([])
  const [count, setCount] = useState(0)
  const [coreX, coreY] = useMemo(() => project(DETECTION_CORE.lat, DETECTION_CORE.lon), [])

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let timeoutId = 0
    let cancelled = false

    // Tracked outside React state so the cap check and spawn decision stay outside the
    // setArcs updater - StrictMode double-invokes updater functions in dev to catch
    // impurity, and an updater that generates a random event / schedules timers as a
    // side effect would silently spawn every attack twice.
    let activeCount = 0

    function spawn() {
      if (cancelled) return
      if (activeCount < MAX_ACTIVE) {
        const event = generateSimulatedAttackEvent()
        const [ox, oy] = project(event.city.lat, event.city.lon)
        const arc: ActiveArc = { id: event.id, event, path: bowedPath(ox, oy, coreX, coreY), originX: ox, originY: oy }
        activeCount += 1
        setArcs((prev) => [...prev, arc])
        setCount((c) => c + 1)
        window.setTimeout(() => {
          activeCount -= 1
          setArcs((cur) => cur.filter((a) => a.id !== arc.id))
        }, TOTAL_MS)
      }
      timeoutId = window.setTimeout(spawn, 2000 + Math.random() * 2000)
    }

    if (!reducedMotion) timeoutId = window.setTimeout(spawn, 400)

    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
    }
  }, [coreX, coreY])

  return (
    <div className={`relative overflow-hidden bg-[#050b12] ${className}`}>
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        {dots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1} fill="rgba(56,189,248,0.28)" />)}

        <circle cx={coreX} cy={coreY} r={5} fill="#818cf8" />
        <circle cx={coreX} cy={coreY} r={9} fill="none" stroke="#818cf8" strokeOpacity={0.35} strokeWidth={1} />

        {arcs.map((arc) => {
          const outcomeColor = OUTCOME_COLOR[arc.event.outcome]
          return (
            <g key={arc.id}>
              <motion.path
                d={arc.path}
                fill="none"
                strokeWidth={2}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 1 }}
                animate={{
                  pathLength: [0, 1, 1, 1],
                  opacity: [1, 1, 1, 0],
                  stroke: [TRAVEL_COLOR, TRAVEL_COLOR, outcomeColor, outcomeColor],
                }}
                transition={{ duration: TOTAL_MS / 1000, times: KEYFRAME_TIMES, ease: "easeInOut" }}
              />
              {/* Origin pulse - fires once as the attack leaves its origin city. */}
              <motion.circle
                cx={arc.originX}
                cy={arc.originY}
                r={3}
                fill="none"
                stroke={TRAVEL_COLOR}
                strokeWidth={1.5}
                initial={{ r: 3, opacity: 0.9 }}
                animate={{ r: 14, opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />
              {/* Arrival ping at the Detection Core, colored by outcome, timed to land
                  right as the arc finishes drawing. */}
              <motion.circle
                cx={coreX}
                cy={coreY}
                r={5}
                fill="none"
                strokeWidth={2}
                initial={{ r: 5, opacity: 0 }}
                animate={{ r: [5, 5, 24], opacity: [0, 0.9, 0], stroke: [outcomeColor, outcomeColor, outcomeColor] }}
                transition={{ duration: TOTAL_MS / 1000, times: [0, KEYFRAME_TIMES[1], 1], ease: "easeOut" }}
              />
            </g>
          )
        })}
      </svg>

      <div className="pointer-events-none absolute left-4 top-4 font-mono text-[10px] uppercase tracking-wider text-cyan-300/80">
        <p className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-cyan-400 status-pulse" /> Attacks simulated: {count}</p>
      </div>

      <div className="pointer-events-none absolute bottom-4 left-4 flex flex-wrap gap-4 font-mono text-[10px] uppercase tracking-wider">
        {(Object.keys(OUTCOME_LABEL) as SimOutcome[]).map((outcome) => (
          <span key={outcome} className="flex items-center gap-1.5" style={{ color: OUTCOME_COLOR[outcome] }}>
            <span className="size-2 rounded-full" style={{ background: OUTCOME_COLOR[outcome] }} /> {OUTCOME_LABEL[outcome]}
          </span>
        ))}
      </div>

      <div className="pointer-events-none absolute bottom-4 right-4 font-mono text-[9px] uppercase tracking-wider text-indigo-300/70">
        {DETECTION_CORE.name}
      </div>
    </div>
  )
}
