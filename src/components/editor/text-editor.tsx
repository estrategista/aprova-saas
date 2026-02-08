"use client";

import { useState, useCallback, useRef } from "react";
import { AlertTriangle, CheckCircle2, Loader2, Wand2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLiveScore } from "@/hooks/use-live-score";
import { LiveScoreBadge } from "@/components/scoring/live-score-badge";
import { LiveScoreHeader } from "@/components/scoring/live-score-header";

interface Campo {
  id: string;
  nome: string;
  curto?: string | null;
  criterioId?: string | null;
  maxChars: number;
  template?: string | null;
  conteudo?: string | null;
  placeholder?: string | null;
}

interface TextEditorProps {
  editalId: string;
  campos: Campo[];
  orcamentoItems?: { nome: string; valor: number }[];
  valorTotal?: number;
}

export function TextEditor({ editalId, campos, orcamentoItems = [], valorTotal = 0 }: TextEditorProps) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    campos.forEach((c) => { initial[c.id] = c.conteudo || ""; });
    return initial;
  });
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [generating, setGenerating] = useState<Record<string, boolean>>({});
  const [activeCampo, setActiveCampo] = useState<string | null>(campos[0]?.id || null);
  const timeoutRefs = useRef<Record<string, NodeJS.Timeout>>({});

  const { fieldScores, totalScore, riskLevel } = useLiveScore(
    campos.map((c) => ({ id: c.id, criterioId: c.criterioId, maxChars: c.maxChars })),
    values,
    orcamentoItems,
    valorTotal
  );

  const saveField = useCallback(async (campoId: string, content: string) => {
    setSaving((prev) => ({ ...prev, [campoId]: true }));
    setSaved((prev) => ({ ...prev, [campoId]: false }));
    try {
      await fetch(`/api/editais/${editalId}/campos`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campoId, conteudo: content }),
      });
      setSaved((prev) => ({ ...prev, [campoId]: true }));
      setTimeout(() => setSaved((prev) => ({ ...prev, [campoId]: false })), 2000);
    } catch (err) { console.error("Erro ao salvar:", err); }
    finally { setSaving((prev) => ({ ...prev, [campoId]: false })); }
  }, [editalId]);

  function handleChange(campoId: string, value: string) {
    setValues((prev) => ({ ...prev, [campoId]: value }));
    if (timeoutRefs.current[campoId]) clearTimeout(timeoutRefs.current[campoId]);
    timeoutRefs.current[campoId] = setTimeout(() => saveField(campoId, value), 500);
  }

  function loadTemplate(campoId: string, template: string) {
    setValues((prev) => ({ ...prev, [campoId]: template }));
    saveField(campoId, template);
  }

  async function generateWithAI(campo: Campo) {
    setGenerating((prev) => ({ ...prev, [campo.id]: true }));
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campo: campo.nome, criterio: campo.criterioId, editalNome: "Edital" }),
      });
      if (!res.ok) throw new Error("Erro na IA");
      const data = await res.json();
      if (data.text) { setValues((prev) => ({ ...prev, [campo.id]: data.text })); saveField(campo.id, data.text); }
    } catch (err) { console.error("Erro ao gerar:", err); }
    finally { setGenerating((prev) => ({ ...prev, [campo.id]: false })); }
  }

  function hasAccents(text: string): boolean {
    return text !== text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  return (
    <div>
      <LiveScoreHeader totalScore={totalScore} riskLevel={riskLevel} />

      <div className="flex gap-4">
        <div className="w-48 shrink-0 hidden lg:block space-y-1">
          {campos.map((campo) => {
            const text = values[campo.id] || "";
            const percent = Math.round((text.length / campo.maxChars) * 100);
            const fs = fieldScores[campo.id];
            return (
              <button key={campo.id} onClick={() => setActiveCampo(campo.id)} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${activeCampo === campo.id ? "bg-royal/20 text-white border border-royal/30" : "text-slate-400 hover:bg-navy-800 hover:text-white"}`}>
                <div className="flex items-center justify-between">
                  <span className="truncate">{campo.curto || campo.nome}</span>
                  <div className="flex items-center gap-1 ml-1">
                    {fs && <LiveScoreBadge predicted={fs.predicted} grade={fs.grade} />}
                    {!fs && text.length > 0 && <Badge variant={percent >= 70 ? "success" : percent >= 40 ? "warning" : "destructive"} className="text-[10px]">{percent}%</Badge>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex-1 min-w-0">
          <div className="lg:hidden mb-4">
            <select value={activeCampo || ""} onChange={(e) => setActiveCampo(e.target.value)} className="w-full bg-navy-800 border border-navy-600 rounded-lg px-3 py-2 text-sm text-white">
              {campos.map((c) => {
                const fs = fieldScores[c.id];
                return <option key={c.id} value={c.id}>{c.curto || c.nome}{fs ? ` (${fs.predicted}/10)` : ""}</option>;
              })}
            </select>
          </div>

          {campos.filter((c) => c.id === activeCampo).map((campo) => {
            const text = values[campo.id] || "";
            const charCount = text.length;
            const charPercent = Math.round((charCount / campo.maxChars) * 100);
            const textHasAccents = hasAccents(text);

            return (
              <div key={campo.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-white">{campo.nome}</h3>
                    {campo.criterioId && <span className="text-xs text-slate-500">Criterio: {campo.criterioId.toUpperCase()}</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    {saving[campo.id] && <span className="flex items-center gap-1 text-xs text-slate-400"><Loader2 className="w-3 h-3 animate-spin" />Salvando...</span>}
                    {saved[campo.id] && <span className="flex items-center gap-1 text-xs text-green-400"><CheckCircle2 className="w-3 h-3" />Salvo</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {campo.template && <Button size="sm" variant="outline" onClick={() => loadTemplate(campo.id, campo.template!)}>Carregar Template</Button>}
                  <Button size="sm" variant="secondary" onClick={() => generateWithAI(campo)} disabled={generating[campo.id]}>
                    <Wand2 className="w-3 h-3" /> {generating[campo.id] ? "Gerando..." : "Gerar com IA"}
                  </Button>
                </div>

                <Textarea value={text} onChange={(e) => handleChange(campo.id, e.target.value)} placeholder={campo.placeholder || `Escreva o conteudo de "${campo.nome}"...`} className="min-h-[400px] font-mono text-sm" maxLength={campo.maxChars} />

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className={charPercent > 95 ? "text-red-400" : charPercent > 70 ? "text-green-400" : "text-slate-400"}>
                      {charCount.toLocaleString("pt-BR")} / {campo.maxChars.toLocaleString("pt-BR")} ({charPercent}%)
                    </span>
                    {textHasAccents && <span className="flex items-center gap-1 text-amber-400"><AlertTriangle className="w-3 h-3" />Acentos detectados</span>}
                  </div>
                  <div className="w-24 h-1.5 bg-navy-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${charPercent > 95 ? "bg-red-500" : charPercent > 70 ? "bg-green-500" : "bg-royal"}`} style={{ width: `${Math.min(charPercent, 100)}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
