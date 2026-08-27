import { createContext, useContext } from "react"
import type { AnalyzeResponse } from "@/services/api"
import type { AttackType, Transaction } from "@/types/fraud"

export type SyncedAttackType = AttackType | "Run Full Orchestrator"
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

export interface RedTeamSyncState {
  status: SyncStatus
  attackType: SyncedAttackType | null
  redTeamResult: RedTeamAttackResult | null
  transaction: Transaction | null
  analysis: AnalyzeResponse | null
  error: string
}

export const initialSyncState: RedTeamSyncState = {
  status: "idle",
  attackType: null,
  redTeamResult: null,
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
