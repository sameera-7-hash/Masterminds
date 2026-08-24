import { Activity, CheckCircle2, Cpu, Database, Network, ShieldCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { mockDetectionResult } from "@/mocks/dashboard"

const detectorIcons = [ShieldCheck, Cpu, Database, Network]

export function BlueTeamAnalysis() {
  const { transaction, detectorScores, finalRiskScore, action, explanation } = mockDetectionResult
  const gaugeColor = finalRiskScore > 70 ? "text-red-300" : finalRiskScore >= 40 ? "text-amber-300" : "text-emerald-300"
  return <div className="space-y-8">
    <div><p className="font-mono text-[10px] uppercase tracking-[0.22em] text-blue-400">Detection intelligence / 03</p><h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">Blue Team Analysis</h2><p className="mt-2 text-sm text-slate-500">Inspect how the defense ensemble reached its verdict on the latest transaction.</p></div>
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <Card className="border-blue-500/20 bg-[#0d1520] shadow-none"><CardHeader className="border-b border-slate-800/80 px-5 py-4"><CardTitle className="text-sm font-medium text-slate-100">Transaction summary</CardTitle></CardHeader><CardContent className="grid grid-cols-2 gap-x-5 gap-y-6 p-5">{[["Transaction ID", transaction.id], ["Amount", `${transaction.currency} ${transaction.amount.toLocaleString()}`], ["Device", transaction.device], ["Location", transaction.location], ["Velocity", transaction.velocity], ["Received", "14:32:00 UTC"]].map(([label, value]) => <div key={label}><p className="font-mono text-[10px] uppercase tracking-wider text-slate-600">{label}</p><p className="mt-2 text-sm text-slate-200">{value}</p></div>)}</CardContent></Card>
      <Card className="border-slate-800 bg-[#0d1520] shadow-none"><CardHeader className="border-b border-slate-800/80 px-5 py-4"><CardTitle className="text-sm font-medium text-slate-100">Detector consensus</CardTitle></CardHeader><CardContent className="space-y-5 p-5">{detectorScores.map(({ label, score }, index) => { const Icon = detectorIcons[index]; return <div key={label}><div className="mb-2 flex items-center justify-between"><span className="flex items-center gap-2 text-sm text-slate-300"><Icon className="size-4 text-blue-400" />{label}</span><span className="font-mono text-sm text-slate-200">{score}<span className="text-slate-600">/100</span></span></div><Progress value={score} className="h-1.5 bg-slate-800 [&>div]:bg-blue-400" /></div>})}</CardContent></Card>
    </div>
    <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <Card className="border-slate-800 bg-[#0d1520] shadow-none"><CardContent className="flex flex-col items-center justify-center p-8"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">Final risk score</p><div className={`relative mt-6 flex size-48 items-center justify-center rounded-full border-[14px] border-slate-800 ${gaugeColor}`}><div className="absolute inset-[-14px] rounded-full border-[14px] border-transparent border-t-current border-r-current opacity-80" style={{ transform: `rotate(${finalRiskScore * 2.7 - 45}deg)` }} /><span className="font-mono text-6xl font-semibold">{finalRiskScore}</span></div><Badge variant="outline" className="mt-6 border-amber-500/40 bg-amber-500/10 px-4 py-1.5 font-mono text-xs text-amber-300">ACTION / {action}</Badge><p className="mt-4 flex items-center gap-2 text-xs text-emerald-300"><CheckCircle2 className="size-3.5" />Analysis complete</p></CardContent></Card>
      <Card className="border-slate-800 bg-[#0d1520] shadow-none"><CardHeader className="flex flex-row items-center gap-2 border-b border-slate-800/80 px-5 py-4"><Activity className="size-4 text-blue-400" /><CardTitle className="text-sm font-medium text-slate-100">AI Explanation</CardTitle></CardHeader><CardContent className="p-6"><p className="text-base leading-8 text-slate-300">{explanation}</p><div className="mt-8 grid gap-3 border-t border-slate-800 pt-5 font-mono text-[10px] uppercase tracking-wider text-slate-600 sm:grid-cols-3"><span>4 detectors queried</span><span>0.94 confidence</span><span>14ms response</span></div></CardContent></Card>
    </section>
  </div>
}