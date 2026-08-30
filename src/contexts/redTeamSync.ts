import { createContext, useContext } from "react"
import type { AnalyzeResponse } from "@/services/api"
import type { AttackType, Transaction } from "@/types/fraud"

// "Card Testing" and "Auto / Orchestrator" are agents the live Red Team API supports
// (see fraudshield-redteam-api's app.py) that aren't part of the shared AttackType union
// used by the Analytics/Dashboard mock data - keeping them separate here means adding
// them doesn't ripple into unrelated chart data that assumes exactly five categories.
export type SyncedAttackType = AttackType | "Card Testing" | "Auto / Orchestrator"
export type SyncStatus = "idle" | "generating" | "analyzing" | "complete" | "error"

export interface RawAttackTransaction {
  txn_id?: string
  user_id?: string
  amount?: number
  timestamp?: string
  location?: string
  device_id?: string
  merchant_id?: string
  risk_reason?: string
  [key: string]: unknown
}

export interface RedTeamAttackSignals {
  amount_deviation: number
  device_anomaly: number
  location_anomaly: number
  time_anomaly: number
  velocity: number
}

export interface RedTeamAttackResult {
  success: boolean
  attack_type: string
  fraud_label: number
  transaction: RawAttackTransaction
  signals: RedTeamAttackSignals
  message: string
  error?: string
}

// One entry from "Auto / Orchestrator" mode's `scenarios` array - the same six agents
// run back-to-back against one synthetic user in a single request.
export interface RedTeamOrchestratorScenario {
  attack_type: string
  fraud_label: number
  transaction: RawAttackTransaction
  signals: RedTeamAttackSignals
}

export interface RedTeamSyncState {
  status: SyncStatus
  attackType: SyncedAttackType | null
  redTeamResult: RedTeamAttackResult | null
  orchestratorScenarios: RedTeamOrchestratorScenario[] | null
  transaction: Transaction | null
  analysis: AnalyzeResponse | null
  error: string
}

export const initialSyncState: RedTeamSyncState = {
  status: "idle",
  attackType: null,
  redTeamResult: null,
  orchestratorScenarios: null,
  transaction: null,
  analysis: null,
  error: "",
}

export interface RedTeamSyncContextValue {
  state: RedTeamSyncState
  runAttack: (attackType: SyncedAttackType) => Promise<void>
  reset: () => void
}

export const RedTeamSyncContext = createContext<RedTeamSyncContextValue | null>(null)

export function useRedTeamSync() {
  const ctx = useContext(RedTeamSyncContext)
  if (!ctx) throw new Error("useRedTeamSync must be used within a RedTeamSyncProvider")
  return ctx
}
