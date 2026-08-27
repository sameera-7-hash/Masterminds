import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AppLayout } from "@/components/layout/AppLayout"
import { AdaptiveDefense } from "@/pages/AdaptiveDefense"
import { BlueTeamAnalysis } from "@/pages/BlueTeamAnalysis"
import { CommandCenter } from "@/pages/CommandCenter"
import { RedTeamLab } from "@/pages/RedTeamLab"
import { SecurityHero } from "@/pages/SecurityHero"
import { SignIn } from "@/pages/SignIn"
import { ThreatAnalyzerChat } from "@/pages/ThreatAnalyzerChat"

export function App() {
  return <BrowserRouter><Routes><Route path="/" element={<SecurityHero />} /><Route path="/sign-in" element={<SignIn />} /><Route element={<AppLayout />}><Route path="/command-center" element={<CommandCenter />} /><Route path="/red-team" element={<RedTeamLab />} /><Route path="/blue-team" element={<BlueTeamAnalysis />} /><Route path="/adaptive" element={<AdaptiveDefense />} /><Route path="/threat-analyzer" element={<ThreatAnalyzerChat />} /></Route></Routes></BrowserRouter>
}

export default App
