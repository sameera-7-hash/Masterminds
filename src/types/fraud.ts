export type AttackType =
  | "Account Takeover"
  | "Velocity Fraud"
  | "Behavioral Mimicry"
  | "Transaction Splitting"
  | "Novelty / Zero-Day"

export type ThreatAction = "BLOCK" | "HOLD" | "VERIFY" | "ALLOW"
export type RiskBand = "low" | "medium" | "high"

export interface Transaction {
  id: string
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