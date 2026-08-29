import {
  LayoutDashboard,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Reveal, RevealItem, RevealStagger } from "@/components/motion/Reveal"


// ============================================================
// TEAM DATA
// ============================================================

type Accent = "violet" | "red" | "blue"

const accentStyles: Record<
  Accent,
  { label: string; icon: string; border: string; badge: string; glow: string }
> = {
  violet: {
    label: "Full-stack",
    icon: "border-violet-400/30 bg-violet-500/10 text-violet-300",
    border: "border-slate-800 hover:border-violet-500/40",
    badge: "border-violet-500/30 bg-violet-500/10 text-violet-300",
    glow: "shadow-[0_0_24px_rgba(167,139,250,0.08)]",
  },
  red: {
    label: "Red Team",
    icon: "border-red-400/30 bg-red-500/10 text-red-300",
    border: "border-slate-800 hover:border-red-500/40",
    badge: "border-red-500/30 bg-red-500/10 text-red-300",
    glow: "shadow-[0_0_24px_rgba(239,68,68,0.08)]",
  },
  blue: {
    label: "Blue Team",
    icon: "border-blue-400/30 bg-blue-500/10 text-blue-300",
    border: "border-slate-800 hover:border-blue-500/40",
    badge: "border-blue-500/30 bg-blue-500/10 text-blue-300",
    glow: "shadow-[0_0_24px_rgba(59,130,246,0.08)]",
  },
}

const team = [
  {
    name: "Sameera",
    role: "Dashboard, Backend & Integration Lead",
    summary: "Builds the backend, data layer, and full dashboard, and wires Red Team, Blue Team, and the database into one system.",
    accent: "violet" as Accent,
    icon: LayoutDashboard,
    modules: [
      "FastAPI Backend",
      "Database Schema",
      "Dashboard UI (4 screens)",
      "System Integration",
    ],
  },
  {
    name: "Prathamesh",
    role: "Red Team Lead",
    summary: "Generates synthetic fraud data and drives the six attack agents plus the ML fraud classifier.",
    accent: "red" as Accent,
    icon: ShieldAlert,
    modules: [
      "Synthetic Data Generation",
      "Account Takeover",
      "Velocity Fraud",
      "Behavioral Mimicry",
      "Transaction Splitting",
      "Novelty / Zero-Day",
      "Orchestrator",
      "ML Fraud Classifier",
    ],
  },
  {
    name: "Sahil",
    role: "Blue Team Lead",
    summary: "Owns detection and response: rule engine, RAG + LLM reasoning, graph analysis, risk fusion, and adaptive defense.",
    accent: "blue" as Accent,
    icon: ShieldCheck,
    modules: [
      "Rule / Velocity Engine",
      "RAG + LLM Reasoning",
      "Graph Analysis Engine",
      "Risk Fusion Logic",
      "Adaptive Defense Loop",
    ],
  },
]


// ============================================================
// TEAM PAGE
// ============================================================

export function Team() {
  return (
    <div className="space-y-8">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <Reveal>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-indigo-300">Operations / Roster</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">The Team</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Three roles, one autonomous fraud defense loop.
          </p>
        </div>
      </Reveal>

      {/* ======================================================
          MEMBER CARDS
      ====================================================== */}

      <RevealStagger className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3" step={0.08}>
        {team.map(({ name, role, summary, accent, icon: Icon, modules }) => {
          const styles = accentStyles[accent]
          return (
            <RevealItem key={name}>
              <Card className={`h-full border-slate-800 bg-[#0d1520] shadow-none transition-colors ${styles.border} ${styles.glow}`}>
                <CardHeader className="border-b border-slate-800/80 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex size-10 items-center justify-center rounded border ${styles.icon}`}>
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-medium text-slate-100">{name}</CardTitle>
                      <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-500">{role}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 p-5">
                  <p className="text-sm leading-relaxed text-slate-400">{summary}</p>

                  <div className="flex flex-wrap gap-1.5">
                    {modules.map((module) => (
                      <Badge key={module} variant="outline" className={styles.badge}>
                        {module}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </RevealItem>
          )
        })}
      </RevealStagger>
    </div>
  )
}
