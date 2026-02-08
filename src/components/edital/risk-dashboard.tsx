"use client";

import { useMemo } from "react";
import { AlertTriangle, CheckCircle2, Clock, FileText, Calculator, Target } from "lucide-react";
import { analyzeRisks, predictTotalScore, analyzeBudget, type RiskItem } from "@/lib/ai-engine";
import { Badge } from "@/components/ui/badge";

interface RiskDashboardProps {
  edital: {
    prazo?: string | Date | null;
    valor: number;
    campos: { conteudo?: string | null; criterioId?: string | null; maxChars: number }[];
    orcamento: { nome: string; valor: number }[];
  };
}

const AREA_ICONS: Record<string, typeof Clock> = {
  Prazo: Clock,
  Textos: FileText,
  Orcamento: Calculator,
  Pontuacao: Target,
};

const LEVEL_COLORS: Record<string, string> = {
  low: "border-green-600/30 bg-green-600/5",
  medium: "border-amber-600/30 bg-amber-600/5",
  high: "border-orange-600/30 bg-orange-600/5",
  critical: "border-red-600/30 bg-red-600/5",
};

const LEVEL_TEXT: Record<string, string> = {
  low: "text-green-400",
  medium: "text-amber-400",
  high: "text-orange-400",
  critical: "text-red-400",
};

const LEVEL_LABELS: Record<string, string> = {
  low: "Baixo",
  medium: "Medio",
  high: "Alto",
  critical: "Critico",
};

const LEVEL_BADGE: Record<string, "success" | "warning" | "destructive"> = {
  low: "success",
  medium: "warning",
  high: "destructive",
  critical: "destructive",
};

export function RiskDashboard({ edital }: RiskDashboardProps) {
  const risks = useMemo(
    () => analyzeRisks(edital.prazo || null, edital.campos, edital.orcamento, edital.valor),
    [edital]
  );

  const predictedScore = useMemo(() => {
    const bud = analyzeBudget(edital.orcamento, edital.valor);
    return predictTotalScore(edital.campos, bud.balanced);
  }, [edital]);

  const overallLevel = useMemo(() => {
    const levels = risks.map((r) => r.level);
    if (levels.includes("critical")) return "critical";
    if (levels.includes("high")) return "high";
    if (levels.includes("medium")) return "medium";
    return "low";
  }, [risks]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-white flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Dashboard de Riscos
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Score Predito:</span>
          <Badge variant={predictedScore >= 60 ? "success" : predictedScore >= 40 ? "warning" : "destructive"}>
            {predictedScore}/100
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {risks.map((risk) => {
          const Icon = AREA_ICONS[risk.area] || AlertTriangle;
          return (
            <RiskCard key={risk.area} risk={risk} Icon={Icon} />
          );
        })}
      </div>

      {overallLevel !== "low" && (
        <div className={`rounded-lg border px-4 py-3 ${LEVEL_COLORS[overallLevel]}`}>
          <p className={`text-xs font-medium ${LEVEL_TEXT[overallLevel]}`}>
            {overallLevel === "critical"
              ? "Atencao! Ha riscos criticos que precisam ser resolvidos imediatamente."
              : overallLevel === "high"
              ? "Ha riscos altos que devem ser tratados antes da submissao."
              : "Alguns pontos de atencao identificados."}
          </p>
        </div>
      )}
    </div>
  );
}

function RiskCard({ risk, Icon }: { risk: RiskItem; Icon: typeof Clock }) {
  return (
    <div className={`rounded-xl border p-3 ${LEVEL_COLORS[risk.level]}`}>
      <div className="flex items-center justify-between mb-2">
        <Icon className={`w-4 h-4 ${LEVEL_TEXT[risk.level]}`} />
        <Badge variant={LEVEL_BADGE[risk.level]} className="text-[10px]">
          {LEVEL_LABELS[risk.level]}
        </Badge>
      </div>
      <p className="text-xs font-medium text-white">{risk.area}</p>
      <p className={`text-xs mt-0.5 ${LEVEL_TEXT[risk.level]}`}>{risk.msg}</p>
    </div>
  );
}
