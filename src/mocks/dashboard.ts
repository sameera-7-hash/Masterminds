import type { Attack, DetectionResult, Transaction } from "@/types/fraud"

export const mockTransaction: Transaction = {
  id: "txn_8F4A2C91",
  amount: 2840.5,
  currency: "USD",
  device: "Chrome / macOS",
  location: "Lagos, NG",
  velocity: "7 attempts / 10 min",
  timestamp: "2026-08-25T14:32:00Z",
}

export const mockAttacks: Attack[] = [
  { id: "atk-0192", type: "Account Takeover", agent: "ATK-07 / Specter", description: "Credential reuse with a new device fingerprint", riskScore: 94, action: "BLOCK", createdAt: "2 min ago" },
  { id: "atk-0191", type: "Velocity Fraud", agent: "VEL-03 / Pulse", description: "Burst of low-value authorizations across cards", riskScore: 78, action: "HOLD", createdAt: "8 min ago" },
  { id: "atk-0190", type: "Behavioral Mimicry", agent: "BHV-11 / Echo", description: "Learned customer rhythm with a location mismatch", riskScore: 61, action: "VERIFY", createdAt: "14 min ago" },
  { id: "atk-0189", type: "Transaction Splitting", agent: "SPL-02 / Shard", description: "Four linked payments below the review threshold", riskScore: 52, action: "VERIFY", createdAt: "21 min ago" },
]

export const mockDetectionResult: DetectionResult = {
  transaction: mockTransaction,
  detectorScores: [
    { label: "Rule Engine", score: 83, band: "high" },
    { label: "ML Model", score: 76, band: "high" },
    { label: "RAG Reasoner", score: 69, band: "medium" },
    { label: "Graph Engine", score: 72, band: "high" },
  ],
  finalRiskScore: 78,
  action: "HOLD",
  explanation: "The transaction diverges from the customer’s normal device and location profile. Seven attempts in ten minutes also connect this activity to a known velocity pattern. The ensemble recommends a temporary hold while identity is verified.",
}

export function getDashboardSnapshot() {
  return { transactions: 12847, fraudDetected: 342, attacksRun: 86, averageRiskScore: 43.8, detectionRate: 96.4, falsePositiveRate: 1.8, currentAgent: "ATK-07 / Specter", recentThreats: mockAttacks }
}