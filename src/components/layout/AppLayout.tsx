import { NavLink, Outlet, useLocation } from "react-router-dom"
import { Activity, Bot, Crosshair, Radar, ShieldCheck, TerminalSquare } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const navigation = [
  { label: "Command Center", to: "/", icon: Radar },
  { label: "Red Team Lab", to: "/red-team", icon: Crosshair },
  { label: "Blue Team Analysis", to: "/blue-team", icon: ShieldCheck },
  { label: "Adaptive Defense", to: "/adaptive", icon: Activity },
]

function Navigation({ compact = false }: { compact?: boolean }) {
  return <nav className={compact ? "flex gap-1 overflow-x-auto" : "space-y-1"}>
    {navigation.map(({ label, to, icon: Icon }) => <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => cn(compact ? "whitespace-nowrap px-3 py-2 font-mono text-[10px] uppercase tracking-wider" : "group flex items-center gap-3 border-l-2 px-3 py-3 text-sm transition-colors", isActive ? compact ? "text-red-300" : "border-red-400 bg-red-500/10 text-white" : compact ? "text-slate-500" : "border-transparent text-slate-500 hover:bg-slate-800/50 hover:text-slate-200")}>{!compact && <Icon className="size-4" />}<span>{label}</span>{!compact && label === "Command Center" && <span className="ml-auto size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />}</NavLink>)}
  </nav>
}

export function AppLayout() {
  const location = useLocation()
  const activePage = navigation.find(({ to }) => to === location.pathname)?.label ?? "Command Center"

  return <div className="min-h-svh bg-[#070b12] text-slate-200">
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-slate-800/80 bg-[#0a1019] lg:flex">
      <div className="flex h-20 items-center gap-3 px-6"><div className="flex size-9 items-center justify-center rounded border border-red-500/40 bg-red-500/10 text-red-400 shadow-[0_0_24px_rgba(239,68,68,0.15)]"><TerminalSquare className="size-5" /></div><div><p className="font-mono text-sm font-bold tracking-[0.18em] text-white">FRAUDSHIELD</p><p className="font-mono text-[10px] uppercase tracking-[0.26em] text-slate-500">AI DEFENSE GRID</p></div></div>
      <Separator className="bg-slate-800/80" />
      <div className="px-4 py-6"><p className="mb-3 px-3 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">Operations</p><Navigation /></div>
      <div className="mt-auto p-4"><div className="border border-slate-800 bg-[#0d1520] p-4"><div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-emerald-400"><Bot className="size-3.5" /> System online</div><p className="font-mono text-[11px] leading-relaxed text-slate-500">Autonomous agents are monitoring live simulation traffic.</p></div></div>
    </aside>
    <main className="lg:pl-64">
      <header className="sticky top-0 z-10 flex min-h-20 flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 bg-[#070b12]/95 px-5 py-4 backdrop-blur lg:px-10"><div><p className="font-mono text-[10px] uppercase tracking-[0.22em] text-red-400">SOC / SIMULATION MODE</p><h1 className="mt-1 text-xl font-semibold tracking-tight text-white">{activePage}</h1></div><div className="flex items-center gap-4 font-mono text-[11px] text-slate-500"><span className="hidden sm:inline">AUG 25, 2026 // 14:32:08 UTC</span><span className="flex items-center gap-2 text-emerald-400"><span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />All systems nominal</span></div></header>
      <div className="border-b border-slate-800/80 bg-[#0a1019] px-4 py-2 lg:hidden"><Navigation compact /></div>
      <div className="mx-auto max-w-[1440px] p-5 lg:p-10"><Outlet /></div>
    </main>
  </div>
}