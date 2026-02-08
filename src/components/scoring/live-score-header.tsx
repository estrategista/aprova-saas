"use client";

import { AlertTriangle, CheckCircle2, Target, TrendingUp } from "lucide-react";

interface LiveScoreHeaderProps {
  totalScore: number;
  riskLevel: "low" | "medium" | "high" | "critical";
}

const RISK_CONFIG = {
  low: { label: "Baixo", color: "text-green-400", bg: "bg-green-500", icon: CheckCircle2 },
  medium: { label: "Medio", color: "text-amber-400", bg: "bg-amber-500", icon: TrendingUp },
  high: { label: "Alto", color: "text-orange-400", bg: "bg-orange-500", icon: AlertTriangle },
  critical: { label: "Critico", color: "text-red-400", bg: "bg-red-500", icon: AlertTriangle },
};

export function LiveScoreHeader({ totalScore, riskLevel }: LiveScoreHeaderProps) {
  const risk = RISK_CONFIG[riskLevel];
  const RiskIcon = risk.icon;
  const pct = Math.min(totalScore, 100);
  const scoreColor =
    totalScore >= 75 ? "text-green-400" : totalScore >= 60 ? "text-orange-400" : totalScore >= 40 ? "text-amber-400" : "text-red-400";
  const barColor =
    totalScore >= 75 ? "bg-green-500" : totalScore >= 60 ? "bg-orange-500" : totalScore >= 40 ? "bg-amber-500" : "bg-red-500";

  return (
    <div className="flex items-center gap-4 bg-navy-900 border border-navy-700 rounded-lg px-4 py-2.5 mb-4">
      <div className="flex items-center gap-2">
        <Target className="w-4 h-4 text-neutral-400" />
        <span className="text-xs text-neutral-400">Score Predito</span>
        <span className={`text-lg font-bold ${scoreColor}`}>{totalScore}</span>
        <span className="text-xs text-neutral-500">/100</span>
      </div>

      <div className="flex-1 max-w-48 hidden sm:block">
        <div className="w-full h-2 bg-navy-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className={`flex items-center gap-1 text-xs ${risk.color}`}>
        <RiskIcon className="w-3.5 h-3.5" />
        <span>Risco {risk.label}</span>
      </div>

      {totalScore < 40 && (
        <span className="text-[10px] text-red-400 hidden md:inline">
          Abaixo do corte (40 pts)
        </span>
      )}
    </div>
  );
}
