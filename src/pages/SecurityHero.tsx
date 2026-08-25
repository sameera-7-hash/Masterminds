import { ArrowRight, Check, ShieldCheck, ShieldHalf } from "lucide-react"
import type { CSSProperties } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/Reveal"

const signals = [
  { label: "Threat detected", detail: "Credential stuffing pattern", tone: "danger" },
  { label: "IP verified", detail: "Reputation and geo match", tone: "safe" },
  { label: "Login anomaly", detail: "New device fingerprint", tone: "warning" },
]

const navLinks = [
  { label: "Command Center", to: "/command-center" },
  { label: "Red Team Lab", to: "/red-team" },
  { label: "Blue Team Analysis", to: "/blue-team" },
]

export function SecurityHero() {
  return (
    <main className="min-h-svh overflow-hidden bg-[#05050a] text-white">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <motion.nav
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-between gap-4 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_20px_50px_-20px_rgba(79,70,229,0.35)] backdrop-blur-xl sm:px-6"
        >
          <Link to="/" className="flex items-center gap-2.5 text-sm font-semibold tracking-tight text-white">
            <span className="flex size-8 items-center justify-center rounded-full bg-indigo-500 text-white"><ShieldCheck className="size-4" /></span>
            FraudShield
          </Link>
          <div className="hidden items-center gap-1 rounded-full border border-white/5 bg-white/[0.03] p-1 md:flex">
            {navLinks.map(({ label, to }) => (
              <Link key={to} to={to} className="rounded-full px-4 py-1.5 text-[13px] font-medium text-white/60 transition-colors hover:bg-white/8 hover:text-white">
                {label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Link to="/sign-in" className="rounded-full px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white">
              Log in
            </Link>
            <Link to="/sign-in?mode=signup" className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#0a0a0f] transition-transform hover:-translate-y-0.5">
              Sign up
            </Link>
          </div>
        </motion.nav>

        <section className="security-hero scan-grid relative mt-6 overflow-hidden rounded-[32px] border border-white/10">
          <div className="scan-beam" />
          <div className="relative z-10 grid items-center gap-14 px-6 py-16 lg:grid-cols-[0.85fr_1.15fr] lg:px-14 lg:py-24">
            <div className="relative z-10 max-w-xl">
              <Reveal delay={0.05}>
                <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-indigo-200">
                  <span className="relative flex size-1.5"><span className="absolute inline-flex size-full animate-ping rounded-full bg-indigo-400 opacity-75" /><span className="relative inline-flex size-1.5 rounded-full bg-indigo-300" /></span>
                  Fraud detection, made decisive
                </span>
              </Reveal>
              <Reveal delay={0.14}>
                <h1 className="hero-title text-5xl leading-[1.02] text-white sm:text-6xl lg:text-[4.4rem]">
                  Stop fraud before it becomes a story.
                </h1>
              </Reveal>
              <Reveal delay={0.22}>
                <p className="mt-7 max-w-lg text-base leading-7 text-indigo-100/70 sm:text-lg">
                  FraudShield brings every signal into focus, so your team can move from suspicious activity to confident action in seconds.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <Link to="/command-center" className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#0a0a0f] transition-transform hover:-translate-y-0.5">
                    See the command center <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <Link to="/sign-in" className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-white/80 transition-colors hover:border-white/30 hover:text-white">
                    See what changes
                  </Link>
                </div>
              </Reveal>
              <Reveal delay={0.36}>
                <p className="mt-6 text-sm text-indigo-100/45">Built for security teams</p>
              </Reveal>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 mx-auto w-full max-w-155"
            >
              <span className="absolute -top-4 left-6 z-20 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-[#0a0a12] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-200 shadow-lg">
                <ShieldHalf className="size-3" /> Live feed
              </span>
              <div className="dashboard-card rounded-2xl border border-white/15 bg-black/25 p-4 shadow-2xl shadow-indigo-950/30 backdrop-blur-[20px] sm:p-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/45">Live risk monitor</p>
                    <p className="mt-1 text-sm font-medium text-white">Transaction intelligence</p>
                  </div>
                  <div className="scan-status text-xs font-medium text-white/80">
                    <span className="status-scanning">Scanning...</span>
                    <span className="status-threat">Threat detected</span>
                    <span className="status-verified">Verified</span>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="mb-2 flex items-end justify-between">
                    <span className="text-xs text-white/50">Network scan</span>
                    <span className="text-xs font-medium text-white/70">Live</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="scan-progress h-full rounded-full bg-white" /></div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4 border-b border-white/10 pb-6">
                  <div><p className="text-xs text-white/45">Current risk</p><p className="risk-score mt-2 text-4xl font-semibold tracking-tight text-white" aria-label="Current risk score" /></div>
                  <div><p className="text-xs text-white/45">Signals resolved</p><p className="mt-2 text-4xl font-semibold tracking-tight text-white">24<span className="text-lg text-white/40">/28</span></p></div>
                </div>

                <div className="mt-5 space-y-2.5">
                  {signals.map(({ label, detail, tone }, index) => (
                      <div key={label} className="hero-reveal flex items-center justify-between gap-4 rounded-xl bg-white/6 px-4 py-3 [--delay:var(--signal-delay)]" style={{ "--signal-delay": `${580 + index * 100}ms` } as CSSProperties}>
                      <div className="flex min-w-0 items-center gap-3"><span className={`signal-dot signal-${tone} size-2 shrink-0 rounded-full`} /><div className="min-w-0"><p className="truncate text-sm font-medium text-white/90">{label}</p><p className="truncate text-xs text-white/40">{detail}</p></div></div>
                      <span className={`signal-badge signal-${tone} shrink-0 rounded-full border px-2 py-1 text-[10px] font-medium uppercase tracking-wider`}>{tone === "safe" ? <Check className="size-3" /> : tone}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <RevealStagger className="mt-10 grid gap-4 border-t border-white/5 pt-8 pb-16 sm:grid-cols-3">
          {[
            { label: "False positives cut", value: "-62%" },
            { label: "Signals fused per decision", value: "40+" },
            { label: "Median decision time", value: "180ms" },
          ].map(({ label, value }) => (
            <RevealItem key={label} className="rounded-2xl border border-white/8 bg-white/[0.02] px-5 py-4">
              <p className="text-2xl font-semibold tracking-tight text-white">{value}</p>
              <p className="mt-1 text-xs text-white/40">{label}</p>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </main>
  )
}
