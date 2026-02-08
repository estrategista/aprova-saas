"use client";

import { useState, useEffect, useRef } from "react";
import {
  extractKeywords,
  analyzeTextFull,
  predictFieldScore,
  analyzeBudget,
} from "@/lib/ai-engine";

interface Campo {
  id: string;
  criterioId?: string | null;
  maxChars: number;
}

interface FieldScore {
  campoId: string;
  analysis: number;
  predicted: 0 | 3 | 5 | 7 | 10;
  grade: "A" | "B" | "C" | "D" | "F";
}

interface LiveScoreResult {
  fieldScores: Record<string, FieldScore>;
  totalScore: number;
  riskLevel: "low" | "medium" | "high" | "critical";
}

export function useLiveScore(
  campos: Campo[],
  values: Record<string, string>,
  orcamentoItems: { nome: string; valor: number }[],
  valorTotal: number
): LiveScoreResult {
  const [result, setResult] = useState<LiveScoreResult>({
    fieldScores: {},
    totalScore: 0,
    riskLevel: "high",
  });
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const scores: Record<string, FieldScore> = {};
      let textTotal = 0;

      campos.forEach((campo) => {
        const text = values[campo.id] || "";
        const keywords = extractKeywords(campo.criterioId || "");
        const analysis = analyzeTextFull(text, keywords, campo.maxChars);
        const predicted = predictFieldScore(analysis.score);
        scores[campo.id] = {
          campoId: campo.id,
          analysis: analysis.score,
          predicted,
          grade: analysis.grade,
        };
        textTotal += predicted;
      });

      const bud = analyzeBudget(orcamentoItems, valorTotal);
      textTotal += bud.balanced ? 7 : 3; // e) Orcamento
      textTotal += 7; // i) Viabilidade
      const total = Math.min(100, textTotal);

      const risk: LiveScoreResult["riskLevel"] =
        total < 40 ? "critical" : total < 60 ? "high" : total < 75 ? "medium" : "low";

      setResult({ fieldScores: scores, totalScore: total, riskLevel: risk });
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [campos, values, orcamentoItems, valorTotal]);

  return result;
}
