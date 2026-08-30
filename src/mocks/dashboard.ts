import { getAnalyticsSnapshot } from "@/mocks/analytics"
import type { Attack, DetectionResult, Transaction } from "@/types/fraud"

export const mockTransaction: Transaction = {
  id: "txn_8F4A2C91",
  userId: "usr_2C19F7",
  amount: 2840.5,
  currency: "USD",
  device: "Chrome / macOS",
  location: "Lagos, NG",
  velocity: "7 attempts / 10 min",
  timestamp: "2026-08-25T14:32:00Z",
}

export const mockAttacks: Attack[] = [
  { id: "txn_8F4A2C91", type: "Account Takeover", agent: "ATK-07 / Specter", userId: "usr_2C19F7", amount: 2840.5, description: "Credential reuse with a new device fingerprint", riskScore: 94, action: "CRITICAL_BLOCK", createdAt: "2 min ago" },
  { id: "txn_5B21E043", type: "Velocity Fraud", agent: "VEL-03 / Pulse", userId: "usr_98A4D1", amount: 412.0, description: "Burst of low-value authorizations across cards", riskScore: 78, action: "FLAG", createdAt: "8 min ago" },
  { id: "txn_1C77F9A2", type: "Behavioral Mimicry", agent: "BHV-11 / Echo", userId: "usr_5E3B90", amount: 1190.25, description: "Learned customer rhythm with a location mismatch", riskScore: 61, action: "FLAG", createdAt: "14 min ago" },
  { id: "txn_04D8B6C5", type: "Transaction Splitting", agent: "SPL-02 / Shard", userId: "usr_71F2AC", amount: 899.99, description: "Four linked payments below the review threshold", riskScore: 52, action: "FLAG", createdAt: "21 min ago" },
  { id: "txn_E2A93F10", type: "Novelty / Zero-Day", agent: "NOV-01 / Cipher", userId: "usr_3B8C22", amount: 64.5, description: "Unrecognized pattern cleared by consensus review", riskScore: 18, action: "ALLOW", createdAt: "27 min ago" },
]

export const mockDetectionResult: DetectionResult = {
  transaction: mockTransaction,
  detectorScores: [
    { label: "Layer 1 · Rules", score: 83, band: "high" },
    { label: "Layer 2 · LLM Class", score: 76, band: "high" },
    { label: "Layer 3 · LLM Anomaly", score: 69, band: "medium" },
    { label: "Layer 4 · Graph", score: 72, band: "high" },
    { label: "Layer 5 · RAG", score: 65, band: "medium" },
  ],
  finalRiskScore: 78,
  action: "FLAG",
  explanation: "The transaction diverges from the customer’s normal device and location profile. Seven attempts in ten minutes also connect this activity to a known velocity pattern. The ensemble recommends flagging the transaction while identity is verified.",
}

// detectionRate and falsePositiveRate are read from the Analytics snapshot rather than
// hardcoded here, so Command Center, Analytics, and the public landing page can never
// silently drift apart and show two different numbers for the same metric in a demo.
export function getDashboardSnapshot() {
  const activeAlerts = mockAttacks.filter((attack) => attack.action !== "ALLOW").length
  const { overallDetectionRate, falsePositiveRate } = getAnalyticsSnapshot()
  return { totalAnalyzed: 12847, fraudDetected: 342, attacksRun: 86, averageRiskScore: 43.8, detectionRate: overallDetectionRate, falsePositiveRate, activeAlerts, currentAgent: "ATK-07 / Specter", recentThreats: mockAttacks }
}