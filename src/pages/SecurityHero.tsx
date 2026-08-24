import { ArrowRight, Check, ShieldCheck, Sparkles } from "lucide-react"
import type { CSSProperties } from "react"
import { Link } from "react-router-dom"

const signals = [
  { label: "Threat detected", detail: "Credential stuffing pattern", tone: "danger" },
  { label: "IP verified", detail: "Reputation and geo match", tone: "safe" },
  { label: "Login anomaly", detail: "New device fingerprint", tone: "warning" },
]

export function SecurityHero() {
  return (
    <main className="security-hero min-h-svh overflow-hidden bg-[#f7f8fc] text-[#111827]">
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-7 lg:px-10">
        <Link to="/" className="flex items-center gap-2.5 text-sm font-semibold tracking-tight text-white">
          <span className="flex size-8 items-center justify-center rounded-lg bg-white text-[#312e81]"><ShieldCheck className="size-4" /></span>
          FraudShield
        </Link>
        <div className="flex items-center gap-3 text-sm text-white/70">
          <Link to="/blue-team" className="hidden transition-colors hover:text-white sm:block">Product</Link>
          <Link to="/" className="rounded-full border border-white/20 px-4 py-2 text-white transition-colors hover:bg-white/10">Sign in</Link>
        </div>
      </nav>

      <section className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 pb-20 pt-12 lg:grid-cols-[0.85fr_1.15fr] lg:px-10 lg:pb-28 lg:pt-20">
        <div className="relative z-10 max-w-xl">
          <p className="hero-reveal mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-200 [--delay:80ms]">
            <Sparkles className="size-3.5" /> Fraud detection, made decisive
          </p>
          <h1 className="hero-reveal text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-white [--delay:160ms] sm:text-6xl lg:text-[4.5rem]">
            Stop fraud before it becomes a story.
          </h1>
          <p className="hero-reveal mt-7 max-w-lg text-base leading-7 text-indigo-100/75 [--delay:240ms] sm:text-lg">
            FraudShield brings every signal into focus, so your team can move from suspicious activity to confident action in seconds.
          </p>
          <div className="hero-reveal mt-9 flex flex-wrap items-center gap-4 [--delay:320ms]">
            <Link to="/command-center" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#312e81] transition-transform hover:-translate-y-0.5">
              See the command center <ArrowRight className="size-4" />
            </Link>
            <span className="text-sm text-indigo-100/60">Built for security teams</span>
          </div>
        </div>

        <div className="dashboard-float relative z-10 mx-auto w-full max-w-155 [--delay:180ms]">
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

            <div className="hero-reveal mt-6 [--delay:420ms]">
              <div className="mb-2 flex items-end justify-between">
                <span className="text-xs text-white/50">Network scan</span>
                <span className="text-xs font-medium text-white/70">Live</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="scan-progress h-full rounded-full bg-white" /></div>
            </div>

            <div className="hero-reveal mt-8 grid grid-cols-2 gap-4 border-b border-white/10 pb-6 [--delay:500ms]">
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
        </div>
      </section>
      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-8 text-xs text-white/45 lg:px-10">Trusted signal, clear decisions, fewer false positives.</div>
    </main>
  )
}
