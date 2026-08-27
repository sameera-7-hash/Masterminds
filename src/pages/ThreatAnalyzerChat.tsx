import { useState } from "react"
import type { FormEvent } from "react"
import { AlertTriangle, Bot, Loader2, Send, ShieldQuestion, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Reveal } from "@/components/motion/Reveal"
import { sendThreatChatMessage } from "@/services/api"
import type { ThreatChatMatch } from "@/services/api"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  matchedThreats?: ThreatChatMatch[]
  confidenceScore?: number
}

const severityStyles: Record<string, string> = {
  HIGH: "border-red-500/40 bg-red-500/10 text-red-300",
  MEDIUM: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  LOW: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
}

function ThreatMatchCard({ match }: { match: ThreatChatMatch }) {
  const severity = (match.severity ?? "UNKNOWN").toUpperCase()
  return (
    <div className="border border-slate-800 bg-[#0d1520] p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-slate-200">{match.attack_type ?? "Unknown pattern"}</span>
        <Badge variant="outline" className={severityStyles[severity] ?? "border-slate-700 text-slate-400"}>
          {severity}
        </Badge>
      </div>
      {match.explanation && <p className="mt-2 text-xs leading-relaxed text-slate-500">{match.explanation}</p>}
      <div className="mt-2 flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider text-slate-600">
        {match.recommended_action && <span>Action: {match.recommended_action}</span>}
        {typeof match.similarity === "number" && <span>Similarity: {match.similarity.toFixed(3)}</span>}
      </div>
    </div>
  )
}

export function ThreatAnalyzerChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [txnId, setTxnId] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const query = input.trim()
    if (!query || loading) return

    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", content: query }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)
    setError("")

    try {
      const response = await sendThreatChatMessage(query, txnId.trim() || undefined)
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: response.answer,
          matchedThreats: response.matched_threats,
          confidenceScore: response.confidence_score,
        },
      ])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to reach the threat analyzer backend.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <Reveal>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-yellow-300">
            Detection intelligence / 04
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">Threat Analyzer Chatbot</h2>
          <p className="mt-2 text-sm text-slate-500">
            Ask about attack patterns and get answers grounded in the sentinelpay-threats vector index.
          </p>
        </div>
      </Reveal>

      {error && (
        <Reveal>
          <div className="flex items-start gap-2.5 border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-xs text-amber-200">
            <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        </Reveal>
      )}

      <Reveal delay={0.1}>
        <Card className="border-slate-800 bg-[#0d1520] shadow-none">
          <CardHeader className="border-b border-slate-800/80 px-5 py-4">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-100">
              <ShieldQuestion className="size-4 text-blue-400" />
              Ask the threat analyst
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 p-5">
            <div className="min-h-40 space-y-4">
              {messages.length === 0 && (
                <p className="text-sm text-slate-600">
                  No messages yet. Try: &ldquo;What does a card testing ring look like?&rdquo;
                </p>
              )}
              {messages.map((message) => (
                <div key={message.id} className="flex gap-3">
                  <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-slate-800 bg-[#111826]">
                    {message.role === "user" ? (
                      <User className="size-3.5 text-slate-400" />
                    ) : (
                      <Bot className="size-3.5 text-blue-400" />
                    )}
                  </div>
                  <div className="flex-1 space-y-3">
                    <p className="text-sm leading-7 text-slate-300">{message.content}</p>
                    {message.confidenceScore !== undefined && message.matchedThreats && message.matchedThreats.length > 0 && (
                      <>
                        <p className="font-mono text-[10px] uppercase tracking-wider text-slate-600">
                          Matched threats · confidence {message.confidenceScore.toFixed(2)}
                        </p>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {message.matchedThreats.map((match, index) => (
                            <ThreatMatchCard key={`${message.id}_${index}`} match={match} />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Loader2 className="size-3.5 animate-spin" />
                  Querying threat index and synthesizing an answer...
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 border-t border-slate-800 pt-4">
              <input
                value={txnId}
                onChange={(event) => setTxnId(event.target.value)}
                placeholder="Optional transaction ID for context (e.g. txn_0001)"
                className="w-full border border-slate-800 bg-[#111826] px-3 py-2 font-mono text-xs text-slate-300 placeholder:text-slate-600 focus:border-blue-500/50 focus:outline-none"
              />
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask about a threat pattern..."
                  className="flex-1 border border-slate-800 bg-[#111826] px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-blue-500/50 focus:outline-none"
                />
                <Button type="submit" disabled={loading || !input.trim()} className="shrink-0">
                  {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Send className="size-3.5" />}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </Reveal>
    </div>
  )
}
