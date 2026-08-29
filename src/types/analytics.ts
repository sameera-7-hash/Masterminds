import type { AttackType } from "./fraud"

export interface DetectionTrendPoint {
  cycle: number
  label: string
  beforeAdaptive: number
  afterAdaptive: number
}

export interface FalsePositiveTrendPoint {
  cycle: number
  label: string
  falsePositiveRate: number
}

export interface AttackTypeCount {
  type: AttackType
  count: number
}

export type ImpactStatus = "Missed" | "Detected"

export interface AdaptiveImpactLogEntry {
  id: string
  attackType: AttackType
  initialDetection: ImpactStatus
  postFeedbackDetection: ImpactStatus
  improvement: number
}

export interface AnalyticsSnapshot {
  totalAttacksSimulated: number
  overallDetectionRate: number
  falsePositiveRate: number
  adaptiveImprovement: number
  detectionTrend: DetectionTrendPoint[]
  falsePositiveTrend: FalsePositiveTrendPoint[]
  attacksByType: AttackTypeCount[]
  impactLog: AdaptiveImpactLogEntry[]
}
