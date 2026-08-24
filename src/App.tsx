import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AppLayout } from "@/components/layout/AppLayout"
import { AdaptiveDefense } from "@/pages/AdaptiveDefense"
import { BlueTeamAnalysis } from "@/pages/BlueTeamAnalysis"
import { CommandCenter } from "@/pages/CommandCenter"
import { RedTeamLab } from "@/pages/RedTeamLab"
import { SecurityHero } from "@/pages/SecurityHero"

export function App() {
  return <BrowserRouter><Routes><Route path="/" element={<SecurityHero />} /><Route element={<AppLayout />}><Route path="/command-center" element={<CommandCenter />} /><Route path="/red-team" element={<RedTeamLab />} /><Route path="/blue-team" element={<BlueTeamAnalysis />} /><Route path="/adaptive" element={<AdaptiveDefense />} /></Route></Routes></BrowserRouter>
}

export default App
