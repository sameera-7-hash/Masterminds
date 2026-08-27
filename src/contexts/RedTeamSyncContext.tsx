import { useCallback, useMemo, useState, type ReactNode } from "react"
import { analyzeTransaction } from "@/services/api"
import type { Transaction } from "@/types/fraud"
import {
  initialSyncState,
  RedTeamSyncContext,
  type RawAttackTransaction,
  type RedTeamAttackResult,
  type RedTeamSyncState,
  type SyncedAttackType,
} from "@/contexts/redTeamSync"

const RED_TEAM_API = "https://fraudshield-redteam-api.onrender.com"

// The Render-hosted Red Team API and the local Blue Team analysis API don't share a
// transaction schema, so the synthetic payload is remapped into the UI's Transaction
// shape here — the one place both panels read from.
function toUiTransaction(raw: RawAttackTransaction, attackType: string): Transaction {
  return {
    id: raw.txn_id ?? `txn_${Date.now().toString(36)}`,
    userId: raw.user_id ?? "unknown_user",
    amount: Number(raw.amount ?? 0),
    currency: "USD",
    device: raw.device_id ?? "Unknown device",
    location: raw.location ?? "Unknown location",
    // The Red Team API doesn't report a velocity metric for synthetic transactions,
    // so this is labeled by scenario rather than presented as a measured value.
    velocity: `Synthetic · ${attackType}`,
    timestamp: raw.timestamp ?? new Date().toISOString(),
  }
}

export function RedTeamSyncProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RedTeamSyncState>(initialSyncState)

  const runAttack = useCallback(async (attackType: SyncedAttackType) => {
    if (attackType === "Run Full Orchestrator") {
      setState({ ...initialSyncState, status: "error", attackType, error: "Run Full Orchestrator is not connected to a backend yet." })
      return
    }

    setState({ ...initialSyncState, status: "generating", attackType })

    let redTeamResult: RedTeamAttackResult
    try {
      const response = await fetch(`${RED_TEAM_API}/red-team/attack`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attack_type: attackType }),
      })
      const data: RedTeamAttackResult = await response.json()
      if (!response.ok || !data.success) throw new Error(data.error || "Attack generation failed.")
      redTeamResult = data
    } catch (error) {
      setState((prev) => ({ ...prev, status: "error", error: error instanceof Error ? error.message : "Unable to reach the Red Team API." }))
      return
    }

    const transaction = toUiTransaction(redTeamResult.transaction, attackType)
    setState((prev) => ({ ...prev, status: "analyzing", redTeamResult, transaction }))

    try {
      const analysis = await analyzeTransaction({ transaction })
      setState((prev) => ({ ...prev, status: "complete", analysis }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        status: "error",
        error: error instanceof Error ? error.message : "Unable to reach the Blue Team analysis backend.",
      }))
    }
  }, [])

  const reset = useCallback(() => setState(initialSyncState), [])

  const value = useMemo(() => ({ state, runAttack, reset }), [state, runAttack, reset])

  return <RedTeamSyncContext.Provider value={value}>{children}</RedTeamSyncContext.Provider>
}
