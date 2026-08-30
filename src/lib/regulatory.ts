import { Database, Eye, FileCheck, Scale, type LucideIcon } from "lucide-react"

export interface RegulatoryPoint {
  icon: LucideIcon
  text: string
}

// Shown on both the public landing page and inside the authenticated Analytics page,
// so a reader sees the identical trust/compliance language in both places rather than
// two independently-worded versions that could drift apart.
export const REGULATORY_POINTS: RegulatoryPoint[] = [
  { icon: Database, text: "Synthetic-data-only architecture — no real customer PII used in testing or training" },
  { icon: FileCheck, text: "Designed with DPDP Act consent principles in mind" },
  { icon: Scale, text: "Aligned with RBI fraud-monitoring and transaction-risk guidance" },
  { icon: Eye, text: "Every decision is explainable — no black-box risk scores" },
]
