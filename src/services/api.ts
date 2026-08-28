import type { Transaction as UiTransaction, ThreatAction } from "@/types/fraud"

// The classical ML Blue Team API (red-team01/sentinelpay/blue_team_api.py), deployed at
// blueteam01.onrender.com. Falls back to it so the app works with zero local setup;
// override with VITE_API_BASE_URL to point at a locally-run instance instead
// (local dev port: 8011, see red-team01/sentinelpay/start.bat).
const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://blueteam01.onrender.com"

// blue_team_api.py has no chat/RAG/feedback routes - those live only in the separate
// blue_team_fraud_engine service (LLM-native: Claude classification + Claude anomaly +
// graph + RAG, contract confirmed against its live /openapi.json). Falls back to the
// deployed instance so the chatbot works with zero local setup; override with
// VITE_CHAT_API_BASE_URL to point at a locally-run `uvicorn` instance instead.
const CHAT_API_BASE_URL = import.meta.env.VITE_CHAT_API_BASE_URL || "https://fraudshield-chatbot.onrender.com"

async function request<T>(baseUrl: string, path: string, options: RequestInit): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  })
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(data?.detail ?? data?.error ?? `Request to ${path} failed with status ${response.status}.`)
  }
  return data as T
}

// blue_team_api.py's Transaction model (POST /transaction) is the enforced contract;
// the UI's Transaction type is a lighter display shape, so the analyze call maps
// between the two rather than changing either.
interface BackendTransaction {
  transaction_id: string
  user_id: string
  amount: number
  timestamp: string
  device_id: string
  merchant_id: string
  location: string
}

type BackendDecision = "BLOCK" | "HOLD" | "ALLOW"

interface BackendRiskAnalysis {
  ml_score: number
  rule_score: number
  anomaly_score: number
  graph_score: number
  final_risk_score: number
  decision: BackendDecision
}

// The deployed blueteam01.onrender.com nests scores under risk_analysis, but the local
// blue_team_api.py source returns them flat at the top level - confirmed by probing
// both directly. Which one answers depends on which is actually running, so both
// shapes are accepted here rather than assuming one.
type BackendAnalysisResult = BackendRiskAnalysis | { risk_analysis: BackendRiskAnalysis }

function extractRisk(result: BackendAnalysisResult): BackendRiskAnalysis {
  return "risk_analysis" in result ? result.risk_analysis : result
}

const DECISION_MAP: Record<BackendDecision, ThreatAction> = {
  BLOCK: "CRITICAL_BLOCK",
  HOLD: "FLAG",
  ALLOW: "ALLOW",
}

function toBackendTransaction(transaction: UiTransaction): BackendTransaction {
  return {
    transaction_id: transaction.id,
    user_id: transaction.userId,
    amount: transaction.amount,
    // The live backend 500s on tz-aware timestamps ("Invalid comparison between
    // dtype=datetime64[us] and Timestamp") - confirmed by probing it directly with and
    // without a trailing Z. Stripping the offset avoids that pandas dtype mismatch.
    timestamp: transaction.timestamp.replace(/(\.\d+)?(Z|[+-]\d{2}:?\d{2})$/, ""),
    device_id: transaction.device,
    merchant_id: "unknown_merchant", // not tracked by the UI's Transaction type
    location: transaction.location,
  }
}

// blue_team_api.py returns raw scores only, no prose - it never calls an LLM. This
// composes a short, honest summary from the real numbers instead of fabricating
// analyst-style text the backend never produced.
function summarizeDecision(risk: BackendRiskAnalysis): string {
  const drivers = [
    { label: "the ML classifier", score: risk.ml_score },
    { label: "the rule engine", score: risk.rule_score },
    { label: "the anomaly detector", score: risk.anomaly_score },
    { label: "graph analysis", score: risk.graph_score },
  ].sort((a, b) => b.score - a.score)
  const top = drivers[0]

  return `Final risk score ${risk.final_risk_score.toFixed(1)}/100 -> ${risk.decision}. Highest contributing signal: ${top.label} at ${top.score.toFixed(1)}/100.`
}

export interface AnalyzeTransactionPayload {
  transaction: UiTransaction
}

export interface AnalyzeLayerScore {
  label: string
  score: number
}

export interface AnalyzeResponse {
  layers: AnalyzeLayerScore[]
  final_risk_score: number
  decision: ThreatAction
  explanation: string
}

export async function analyzeTransaction(payload: AnalyzeTransactionPayload): Promise<AnalyzeResponse> {
  const result = await request<BackendAnalysisResult>(API_BASE, "/transaction", {
    method: "POST",
    body: JSON.stringify(toBackendTransaction(payload.transaction)),
  })
  const risk = extractRisk(result)

  return {
    layers: [
      { label: "Rule Engine", score: risk.rule_score },
      { label: "ML Classifier", score: risk.ml_score },
      { label: "Anomaly Detector", score: risk.anomaly_score },
      { label: "Graph Analysis", score: risk.graph_score },
    ],
    final_risk_score: risk.final_risk_score,
    decision: DECISION_MAP[risk.decision],
    explanation: summarizeDecision(risk),
  }
}

export interface BlueTeamStatus {
  total_transactions: number
  blocked: number
  held: number
  allowed: number
  average_risk: number
  high_risk: number
}

export function fetchBlueTeamStatus() {
  return request<BlueTeamStatus>(API_BASE, "/dashboard/summary", { method: "GET" })
}

export interface ThreatChatMatch {
  txn_id?: string
  attack_type?: string
  explanation?: string
  severity?: string
  recommended_action?: string
  similarity?: number
  [key: string]: unknown
}

export interface ThreatChatResponse {
  answer: string
  matched_threats: ThreatChatMatch[]
  confidence_score: number
}

export function sendThreatChatMessage(query: string, txnId?: string) {
  return request<ThreatChatResponse>(CHAT_API_BASE_URL, "/api/chat/threat-analyzer", {
    method: "POST",
    body: JSON.stringify({ user_query: query, txn_id: txnId ?? null }),
  })
}

export type FeedbackVerdict = "CONFIRMED_FRAUD" | "FALSE_POSITIVE"

export interface FeedbackPayload {
  txnId: string
  verdict: FeedbackVerdict
  notes: string
}

// blue_team_fraud_engine's /api/feedback expects { txn_id, is_fraud, analyst_notes } and
// its success schema isn't typed in its own OpenAPI doc (probing it returns a 502 until
// the backend's Pinecone key is configured) - so this only maps the request shape and
// leaves the response as whatever comes back rather than assuming a field that may not exist.
export function submitFeedback(payload: FeedbackPayload) {
  return request<unknown>(CHAT_API_BASE_URL, "/api/feedback", {
    method: "POST",
    body: JSON.stringify({
      txn_id: payload.txnId,
      is_fraud: payload.verdict === "CONFIRMED_FRAUD",
      analyst_notes: payload.notes,
    }),
  })
}
