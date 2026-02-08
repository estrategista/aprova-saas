"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Calculator, Target, Calendar, Shield, AlertTriangle, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TextEditor } from "@/components/editor/text-editor";
import { BudgetTable } from "@/components/budget/budget-table";
import { ScoreSimulator } from "@/components/scoring/score-simulator";
import { TimelineView } from "@/components/timeline/timeline-view";
import { QualityGate } from "@/components/edital/quality-gate";
import { RiskDashboard } from "@/components/edital/risk-dashboard";
import { SearchPlatforms } from "@/components/edital/search-platforms";
import { predictTotalScore, analyzeBudget } from "@/lib/ai-engine";

interface EditalTabsProps {
  edital: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const TABS = [
  { id: "textos", label: "Textos", icon: FileText },
  { id: "orcamento", label: "Orcamento", icon: Calculator },
  { id: "scoring", label: "Pontuacao", icon: Target },
  { id: "timeline", label: "Timeline", icon: Calendar },
  { id: "qualidade", label: "Qualidade", icon: Shield },
  { id: "riscos", label: "Riscos", icon: AlertTriangle },
  { id: "busca", label: "Busca", icon: Search },
];

export function EditalTabs({ edital }: EditalTabsProps) {
  const [activeTab, setActiveTab] = useState("textos");

  const predictedScore = useMemo(() => {
    const orcItems = (edital.orcamento || []).map((i: any) => ({ nome: i.nome, valor: i.valor })); // eslint-disable-line @typescript-eslint/no-explicit-any
    const bud = analyzeBudget(orcItems, edital.valor);
    const campos = (edital.campos || []).map((c: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
      conteudo: c.conteudo,
      criterioId: c.criterioId,
      maxChars: c.maxChars,
    }));
    return predictTotalScore(campos, bud.balanced);
  }, [edital]);

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white mb-2">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Link>
          <h1 className="text-xl font-bold text-white">{edital.nome}</h1>
          {edital.orgao && <p className="text-sm text-slate-400 mt-1">{edital.orgao}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={edital.status === "draft" ? "secondary" : edital.status === "active" ? "default" : "success"}>
            {edital.status === "draft" ? "Rascunho" : edital.status === "active" ? "Ativo" : edital.status}
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-1 bg-navy-900 border border-navy-700 rounded-lg p-1 mb-6 overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${activeTab === tab.id ? "bg-royal text-white" : "text-slate-400 hover:text-white hover:bg-navy-800"}`}>
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "textos" && <TextEditor editalId={edital.id} campos={edital.campos} />}
      {activeTab === "orcamento" && <BudgetTable editalId={edital.id} items={edital.orcamento} valorTotal={edital.valor} />}
      {activeTab === "scoring" && <ScoreSimulator criterios={edital.criterios} bonus={edital.bonus} predictedScore={predictedScore} />}
      {activeTab === "timeline" && <TimelineView editalId={edital.id} days={edital.timeline} prazo={edital.prazo} />}
      {activeTab === "qualidade" && <QualityGate edital={edital} />}
      {activeTab === "riscos" && (
        <RiskDashboard edital={{
          prazo: edital.prazo,
          valor: edital.valor,
          campos: edital.campos.map((c: any) => ({ conteudo: c.conteudo, criterioId: c.criterioId, maxChars: c.maxChars })), // eslint-disable-line @typescript-eslint/no-explicit-any
          orcamento: edital.orcamento.map((i: any) => ({ nome: i.nome, valor: i.valor })), // eslint-disable-line @typescript-eslint/no-explicit-any
        }} />
      )}
      {activeTab === "busca" && <SearchPlatforms />}
    </div>
  );
}
