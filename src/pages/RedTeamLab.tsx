import { useState } from "react"
import { Bot, Check, Crosshair, Fingerprint, Globe2, MapPin, Play, Radar, Split, Timer, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/Reveal"
import type { AttackType, RiskBand } from "@/types/fraud"

const agents: Array<{ name: AttackType | "Auto / Orchestrator"; code: string; detail: string; icon: typeof Crosshair }> = [
  { name: "Account Takeover", code: "ATK-07", detail: "Credential & session abuse", icon: Fingerprint },
  { name: "Velocity Fraud", code: "VEL-03", detail: "Burst transaction patterns", icon: Zap },
  { name: "Behavioral Mimicry", code: "BHV-11", detail: "Customer rhythm simulation", icon: Radar },
  { name: "Transaction Splitting", code: "SPL-02", detail: "Threshold evasion chains", icon: Split },
  { name: "Novelty / Zero-Day", code: "NOV-01", detail: "Unknown attack surface", icon: Crosshair },
  { name: "Auto / Orchestrator", code: "AUTO-00", detail: "Multi-agent campaign", icon: Bot },
]

const signals: Array<{ label: string; value: number; icon: typeof MapPin }> = [
  { label: "Amount deviation", value: 72, icon: Zap },
  { label: "Device anomaly", value: 91, icon: Fingerprint },
  { label: "Location anomaly", value: 64, icon: MapPin },
  { label: "Time anomaly", value: 38, icon: Timer },
  { label: "Velocity", value: 86, icon: Globe2 },
]

function bandFor(value: number): RiskBand { return value > 70 ? "high" : value > 40 ? "medium" : "low" }

export function RedTeamLab() {
  const [selected, setSelected] = useState<AttackType | "Auto / Orchestrator">("Account Takeover")
  const [running, setRunning] = useState(false)
  const [completed, setCompleted] = useState(false)
  const runAttack = () => { setRunning(true); setCompleted(false); window.setTimeout(() => { setRunning(false); setCompleted(true) }, 550) }

  return <div className="space-y-8">
    <Reveal><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="font-mono text-[10px] uppercase tracking-[0.22em] text-red-400">Adversarial simulation / 04</p><h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">Red Team Lab</h2><p className="mt-2 max-w-2xl text-sm text-slate-500">Deploy autonomous attack agents against the current defense posture and surface blind spots before they reach production.</p></div><Button onClick={runAttack} disabled={running} className="bg-red-500 text-white shadow-[0_0_24px_rgba(239,68,68,0.16)] hover:bg-red-400"><Play className="mr-2 size-4 fill-current" />{running ? "Running simulation..." : "Run Attack"}</Button></div></Reveal>
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Reveal delay={0.1}><Card className="border-slate-800 bg-[#0d1520] shadow-none"><CardHeader className="border-b border-slate-800/80 px-5 py-4"><CardTitle className="text-sm font-medium text-slate-100">Select attack agent</CardTitle></CardHeader><CardContent className="p-5"><RevealStagger className="grid gap-3 sm:grid-cols-2" step={0.05}>{agents.map(({ name, code, detail, icon: Icon }) => <RevealItem key={name}><button type="button" onClick={() => setSelected(name)} className={`group flex min-h-28 w-full flex-col justify-between border p-4 text-left transition ${selected === name ? "border-red-500/70 bg-red-500/10 shadow-[0_0_22px_rgba(239,68,68,0.08)]" : "border-slate-800 bg-[#0a1019] hover:border-slate-600"}`}><div className="flex items-start justify-between"><Icon className={`size-5 ${selected === name ? "text-red-400" : "text-slate-500 group-hover:text-slate-300"}`} />{selected === name && <Check className="size-4 text-red-300" />}</div><div><p className="mt-4 text-sm font-medium text-slate-200">{name}</p><p className="mt-1 font-mono text-[10px] text-slate-600">{code} // {detail}</p></div></button></RevealItem>)}</RevealStagger></CardContent></Card></Reveal>
      <Reveal delay={0.18}><Card className="border-slate-800 bg-[#0d1520] shadow-none"><CardHeader className="flex flex-row items-center justify-between border-b border-slate-800/80 px-5 py-4"><div><CardTitle className="text-sm font-medium text-slate-100">Generated scenario</CardTitle><p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-600">{selected}</p></div>{completed ? <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300">READY</Badge> : <Badge variant="outline" className="border-slate-700 text-slate-500">STAGED</Badge>}</CardHeader><CardContent className="space-y-5 p-5"><div className="border-l-2 border-red-500/50 bg-red-500/5 px-4 py-3"><p className="text-sm leading-relaxed text-slate-300">The agent will probe a new device fingerprint, alter transaction timing, and replay a learned customer journey.</p></div>{signals.map(({ label, value, icon: Icon }) => { const band = bandFor(value); return <div key={label}><div className="mb-2 flex items-center justify-between"><span className="flex items-center gap-2 text-xs text-slate-400"><Icon className="size-3.5 text-slate-600" />{label}</span><span className={`font-mono text-[10px] uppercase ${band === "high" ? "text-red-300" : band === "medium" ? "text-amber-300" : "text-emerald-300"}`}>{band} / {value}</span></div><Progress value={value} className="h-1.5 bg-slate-800 [&>div]:bg-red-400" /></div>})}</CardContent></Card></Reveal>
    </div>
  </div>
}