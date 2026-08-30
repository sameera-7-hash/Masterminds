import type {
  AdaptiveImpactLogEntry,
  AnalyticsSnapshot,
  AttackTypeCount,
  DetectionTrendPoint,
  FalsePositiveTrendPoint,
} from "@/types/analytics"
import type { AttackType } from "@/types/fraud"

export const ATTACK_TYPES: AttackType[] = [
  "Account Takeover",
  "Velocity Fraud",
  "Behavioral Mimicry",
  "Transaction Splitting",
  "Novelty / Zero-Day",
]

// Fixed (not random) so the trend is reproducible across renders - a flat "before"
// line the static rule-based layers alone would produce, against a rising "after"
// line as each adaptive feedback cycle folds missed attacks back into the ensemble.
export function generateDetectionTrend(): DetectionTrendPoint[] {
  const before = [71, 73, 70, 74, 72, 75, 73, 76, 74, 77, 75, 78]
  const after = [72, 76, 79, 82, 85, 87, 89, 91, 92, 94, 95, 96.4]
  return before.map((value, index) => ({
    cycle: index + 1,
    label: `Cycle ${index + 1}`,
    beforeAdaptive: value,
    afterAdaptive: after[index],
  }))
}

export function generateFalsePositiveTrend(): FalsePositiveTrendPoint[] {
  const rate = [8.4, 7.6, 6.9, 6.1, 5.4, 4.8, 4.1, 3.5, 2.9, 2.4, 2.1, 1.8]
  return rate.map((falsePositiveRate, index) => ({
    cycle: index + 1,
    label: `Cycle ${index + 1}`,
    falsePositiveRate,
  }))
}

export function generateAttacksByType(): AttackTypeCount[] {
  const counts = [312, 268, 194, 221, 156]
  return ATTACK_TYPES.map((type, index) => ({ type, count: counts[index] }))
}

export function generateAdaptiveImpactLog(): AdaptiveImpactLogEntry[] {
  const entries: Array<[AttackType, "Missed" | "Detected", number]> = [
    ["Account Takeover", "Missed", 22],
    ["Velocity Fraud", "Missed", 18],
    ["Behavioral Mimicry", "Missed", 27],
    ["Transaction Splitting", "Detected", 6],
    ["Novelty / Zero-Day", "Missed", 31],
    ["Account Takeover", "Missed", 14],
    ["Velocity Fraud", "Detected", 4],
    ["Behavioral Mimicry", "Missed", 19],
  ]
  return entries.map(([attackType, initialDetection, improvement], index) => ({
    id: `cycle-${index + 1}`,
    attackType,
    initialDetection,
    postFeedbackDetection: "Detected",
    improvement,
  }))
}

export function getAnalyticsSnapshot(): AnalyticsSnapshot {
  const detectionTrend = generateDetectionTrend()
  const falsePositiveTrend = generateFalsePositiveTrend()
  const attacksByType = generateAttacksByType()
  const impactLog = generateAdaptiveImpactLog()

  const firstAfter = detectionTrend[0].afterAdaptive
  const lastAfter = detectionTrend[detectionTrend.length - 1].afterAdaptive

  return {
    totalAttacksSimulated: attacksByType.reduce((sum, { count }) => sum + count, 0),
    overallDetectionRate: lastAfter,
    falsePositiveRate: falsePositiveTrend[falsePositiveTrend.length - 1].falsePositiveRate,
    adaptiveImprovement: Number((lastAfter - firstAfter).toFixed(1)),
    detectionTrend,
    falsePositiveTrend,
    attacksByType,
    impactLog,
  }
}
