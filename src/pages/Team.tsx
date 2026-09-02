import {
  LayoutDashboard,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react"
import { Link } from "react-router-dom"

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

// This is a public page (linked from the pre-login landing page so an evaluator can
// see who built the system without creating an account), so unlike the other dashboard
// screens it renders its own nav/shell instead of relying on AppLayout's sidebar.
export function Team() {
  return (
    <main className="min-h-svh overflow-hidden bg-[#05050a] text-white">
    <div className="mx-auto max-w-5xl space-y-8 px-4 pt-6 pb-16 sm:px-6 lg:px-8">
      <Reveal>
        <nav className="flex items-center justify-between gap-4 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_20px_50px_-20px_rgba(79,70,229,0.35)] backdrop-blur-xl sm:px-6">
          <Link to="/" className="flex items-center gap-2.5 text-sm font-semibold tracking-tight text-white">
            <span className="flex size-8 items-center justify-center rounded-full bg-indigo-500 text-white"><ShieldCheck className="size-4" /></span>
            FraudShield
          </Link>
          <Link to="/sign-in" className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#0a0a0f] transition-transform hover:-translate-y-0.5">
            Login to Dashboard
          </Link>
        </nav>
      </Reveal>

      {/* ======================================================
          HEADER
      ====================================================== */}

      <Reveal>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-indigo-300">Operations / Roster</p>
          <h2 className="mt-2 text-4xl tracking-tight text-white">The Team</h2>
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
    </main>
  )
}
