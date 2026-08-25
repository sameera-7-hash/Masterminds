import { Link, NavLink, Outlet, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { Activity, Bot, Crosshair, Radar, ShieldCheck, TerminalSquare } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const navigation = [
  { label: "Command Center", to: "/command-center", icon: Radar },
  { label: "Red Team Lab", to: "/red-team", icon: Crosshair },
  { label: "Blue Team Analysis", to: "/blue-team", icon: ShieldCheck },
  { label: "Adaptive Defense", to: "/adaptive", icon: Activity },
]

function Navigation({ compact = false }: { compact?: boolean }) {
  return <nav className={compact ? "flex gap-1 overflow-x-auto" : "space-y-1"}>
  {navigation.map(({ label, to, icon: Icon }) => <NavLink key={to} to={to} end={to === "/command-center"} className={({ isActive }) => cn(compact ? "whitespace-nowrap px-3 py-2 font-mono text-[10px] uppercase tracking-wider" : "group flex items-center gap-3 border-l-2 px-3 py-3 text-sm transition-colors", isActive ? compact ? "text-indigo-300" : "border-indigo-400 bg-indigo-500/10 text-white" : compact ? "text-slate-500" : "border-transparent text-slate-500 hover:bg-slate-800/50 hover:text-slate-200")}>{!compact && <Icon className="size-4" />}<span>{label}</span>{!compact && label === "Command Center" && <span className="ml-auto size-1.5 rounded-full bg-emerald-400" />}</NavLink>)}
  </nav>
}

export function AppLayout() {
  const location = useLocation()
  const activePage = navigation.find(({ to }) => to === location.pathname)?.label ?? "Command Center"

  return <div className="dashboard-shell min-h-svh bg-[#0a0a0f] text-[#e4e4e7]">
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-white/10 bg-[#111118] lg:flex">
      <Link to="/" className="group flex h-20 items-center gap-3 px-6 transition-colors hover:bg-white/5"><div className="flex size-9 items-center justify-center rounded border border-indigo-400/30 bg-indigo-500/10 text-indigo-300 transition-colors group-hover:border-indigo-400/60 group-hover:bg-indigo-500/20"><TerminalSquare className="size-5" /></div><div><p className="font-mono text-sm font-bold tracking-[0.18em] text-white">FRAUDSHIELD</p><p className="font-mono text-[10px] uppercase tracking-[0.26em] text-zinc-500">AI DEFENSE GRID</p></div></Link>
      <Separator className="bg-slate-800/80" />
      <div className="px-4 py-6"><p className="mb-3 px-3 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">Operations</p><Navigation /></div>
      <div className="mt-auto p-4"><div className="border border-white/10 bg-[#18181f] p-4"><div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-emerald-400"><Bot className="size-3.5" /> System online</div><p className="font-mono text-[11px] leading-relaxed text-zinc-500">Autonomous agents are monitoring live simulation traffic.</p></div></div>
    </aside>
    <main className="lg:pl-64">
      <header className="sticky top-0 z-10 flex min-h-20 flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-[#0a0a0f]/95 px-5 py-4 backdrop-blur lg:px-10"><div><p className="font-mono text-[10px] uppercase tracking-[0.22em] text-indigo-300">SOC / SIMULATION MODE</p><h1 className="mt-1 text-xl font-semibold tracking-tight text-white">{activePage}</h1></div><div className="flex items-center gap-4 font-mono text-[11px] text-zinc-500"><span className="hidden sm:inline">AUG 25, 2026 // 14:32:08 UTC</span><span className="flex items-center gap-2 text-emerald-400"><span className="size-2 rounded-full bg-emerald-400" />All systems nominal</span></div></header>
      <div className="border-b border-white/10 bg-[#111118] px-4 py-2 lg:hidden"><Navigation compact /></div>
      <div className="mx-auto max-w-360 overflow-hidden p-5 lg:p-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  </div>
}