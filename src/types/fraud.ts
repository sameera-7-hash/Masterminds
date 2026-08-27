export type AttackType =
  | "Account Takeover"
  | "Velocity Fraud"
  | "Behavioral Mimicry"
  | "Transaction Splitting"
  | "Novelty / Zero-Day"

export type ThreatAction = "ALLOW" | "FLAG" | "CRITICAL_BLOCK"
export type RiskBand = "low" | "medium" | "high"

export interface Transaction {
  id: string
  userId: string
  amount: number
  currency: string
  device: string
  location: string
  velocity: string
  timestamp: string
}

export interface Attack {
  id: string
  type: AttackType
  agent: string
  userId: string
  amount: number
  description: string
  riskScore: number
  action: ThreatAction
  createdAt: string
}

export interface RiskScore {
  label: string
  score: number
  band: RiskBand
}

export interface DetectionResult {
  transaction: Transaction
  detectorScores: RiskScore[]
  finalRiskScore: number
  action: ThreatAction
  explanation: string
}