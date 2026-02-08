"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";

interface Criterio {
  id: string;
  codigo: string;
  nome: string;
  curto?: string | null;
  dica?: string | null;
  peso: number;
  escala: number[];
  pontuacao?: number | null;
}

interface BonusItem {
  id: string;
  nome: string;
  pontos: number;
  destaque: boolean;
  descricao?: string | null;
  ativo: boolean;
}

export function ScoreSimulator({ criterios, bonus: initialBonus }: { criterios: Criterio[]; bonus: BonusItem[] }) {
  const [scores, setScores] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    criterios.forEach((c) => { initial[c.id] = c.pontuacao ?? 0; });
    return initial;
  });
  const [bonusAtivo, setBonusAtivo] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    initialBonus.forEach((b) => { initial[b.id] = b.ativo; });
    return initial;
  });

  const subtotal = useMemo(() => criterios.reduce((sum, c) => sum + (scores[c.id] || 0), 0), [criterios, scores]);
  const bonusTotal = useMemo(() => {
    if (subtotal < 40) return 0;
    return initialBonus.reduce((sum, b) => sum + (bonusAtivo[b.id] ? b.pontos : 0), 0);
  }, [initialBonus, bonusAtivo, subtotal]);
  const total = subtotal + bonusTotal;
  const maxPossivel = criterios.reduce((sum, c) => sum + Math.max(...c.escala), 0);
  const aprovado = subtotal >= 40;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-navy-700 bg-navy-900 p-4 text-center">
          <p className="text-xs text-slate-400 mb-1">Subtotal</p>
          <p className="text-3xl font-bold text-white">{subtotal}</p>
          <p className="text-xs text-slate-500">de {maxPossivel}</p>
        </div>
        <div className="rounded-xl border border-navy-700 bg-navy-900 p-4 text-center">
          <p className="text-xs text-slate-400 mb-1">Bonus</p>
          <p className={`text-3xl font-bold ${bonusTotal > 0 ? "text-green-400" : "text-slate-600"}`}>+{bonusTotal}</p>
          <p className="text-xs text-slate-500">{subtotal < 40 ? "requer 40pts" : "ativo"}</p>
        </div>
        <div className="rounded-xl border border-navy-700 bg-navy-900 p-4 text-center">
          <p className="text-xs text-slate-400 mb-1">Total</p>
          <p className={`text-3xl font-bold ${aprovado ? "text-royal-light" : "text-red-400"}`}>{total}</p>
          <p className="text-xs text-slate-500">pontos</p>
        </div>
        <div className="rounded-xl border border-navy-700 bg-navy-900 p-4 text-center">
          <p className="text-xs text-slate-400 mb-1">Status</p>
          <Badge variant={aprovado ? "success" : "destructive"} className="text-sm mt-2">{aprovado ? "Aprovado" : "Abaixo do corte"}</Badge>
          <p className="text-xs text-slate-500 mt-1">corte: 40pts</p>
        </div>
      </div>

      <div className="rounded-xl border border-navy-700 bg-navy-900">
        <div className="px-4 py-3 border-b border-navy-700"><h3 className="text-sm font-medium text-white">Criterios de Avaliacao</h3></div>
        <div className="divide-y divide-navy-800">
          {criterios.map((c) => (
            <div key={c.id} className="px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-navy-700 flex items-center justify-center text-xs font-mono text-royal-light">{c.codigo}</span>
                  <span className="text-sm text-white">{c.curto || c.nome}</span>
                </div>
                <span className="text-sm font-mono text-white">{scores[c.id] || 0}/{Math.max(...c.escala)}</span>
              </div>
              {c.dica && <p className="text-xs text-slate-500 mb-2 ml-8">{c.dica}</p>}
              <div className="flex items-center gap-1 ml-8">
                {c.escala.map((nota) => (
                  <button key={nota} onClick={() => setScores((prev) => ({ ...prev, [c.id]: nota }))} className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${scores[c.id] === nota ? (nota >= 7 ? "bg-green-600 text-white" : nota >= 5 ? "bg-royal text-white" : nota >= 3 ? "bg-amber-600 text-white" : "bg-red-600 text-white") : "bg-navy-800 text-slate-400 hover:bg-navy-700"}`}>
                    {nota}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {initialBonus.length > 0 && (
        <div className="rounded-xl border border-navy-700 bg-navy-900">
          <div className="px-4 py-3 border-b border-navy-700">
            <h3 className="text-sm font-medium text-white">Bonus de Inducao</h3>
            {subtotal < 40 && <p className="text-xs text-amber-400 mt-1">Bonus so aplicam se subtotal &gt;= 40 pontos</p>}
          </div>
          <div className="divide-y divide-navy-800">
            {initialBonus.map((b) => (
              <div key={b.id} className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={() => setBonusAtivo((prev) => ({ ...prev, [b.id]: !prev[b.id] }))} className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-colors ${bonusAtivo[b.id] ? "bg-royal border-royal text-white" : "border-navy-600 text-transparent"}`}>
                    {bonusAtivo[b.id] && "✓"}
                  </button>
                  <div>
                    <span className="text-sm text-white">{b.nome}</span>
                    {b.descricao && <p className="text-xs text-slate-500">{b.descricao}</p>}
                  </div>
                </div>
                <Badge variant={bonusAtivo[b.id] ? "success" : "outline"}>+{b.pontos}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
