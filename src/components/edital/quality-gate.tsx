"use client";

import { useMemo } from "react";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Check { id: string; label: string; description: string; status: "pass" | "fail" | "warn"; detail: string; }

export function QualityGate({ edital }: { edital: any }) { // eslint-disable-line @typescript-eslint/no-explicit-any
  const checks = useMemo((): Check[] => {
    const results: Check[] = [];
    const campos = edital.campos || [];
    const preenchidos = campos.filter((c: any) => c.conteudo && c.conteudo.length > 100); // eslint-disable-line @typescript-eslint/no-explicit-any
    results.push({ id: "campos", label: "Campos preenchidos", description: "Todos os campos de texto devem ter conteudo significativo (>100 chars)", status: preenchidos.length === campos.length ? "pass" : preenchidos.length > 0 ? "warn" : "fail", detail: `${preenchidos.length}/${campos.length} campos preenchidos` });

    const comAcentos = campos.filter((c: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      if (!c.conteudo) return false;
      return c.conteudo !== c.conteudo.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    });
    results.push({ id: "acentos", label: "Sem acentos", description: "A plataforma pode nao aceitar caracteres acentuados", status: comAcentos.length === 0 ? "pass" : "warn", detail: comAcentos.length === 0 ? "Nenhum acento encontrado" : `${comAcentos.length} campo(s) com acentos` });

    const excedidos = campos.filter((c: any) => c.conteudo && c.conteudo.length > c.maxChars); // eslint-disable-line @typescript-eslint/no-explicit-any
    results.push({ id: "limiteChars", label: "Limite de caracteres", description: "Nenhum campo deve exceder o limite maximo", status: excedidos.length === 0 ? "pass" : "fail", detail: excedidos.length === 0 ? "Todos dentro do limite" : `${excedidos.length} campo(s) excedendo limite` });

    const orcItems = edital.orcamento || [];
    const totalOrc = orcItems.reduce((s: number, i: any) => s + i.valor, 0); // eslint-disable-line @typescript-eslint/no-explicit-any
    const saldo = Math.abs(edital.valor - totalOrc);
    results.push({ id: "orcamento", label: "Orcamento equilibrado", description: `Total deve ser igual a R$ ${edital.valor?.toLocaleString("pt-BR")}`, status: saldo < 0.01 ? "pass" : saldo < edital.valor * 0.05 ? "warn" : "fail", detail: saldo < 0.01 ? "Balanceado" : `Diferenca de R$ ${saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` });

    const cand = edital.candidato;
    results.push({ id: "candidato", label: "Dados do candidato", description: "Nome e informacoes basicas devem estar preenchidos", status: cand && cand.nome ? "pass" : "fail", detail: cand?.nome ? `${cand.nome}${cand.cotas?.length > 0 ? ` (${cand.cotas.join(", ")})` : ""}` : "Candidato nao preenchido" });

    if (edital.prazo) {
      const dias = Math.ceil((new Date(edital.prazo).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      results.push({ id: "prazo", label: "Prazo", description: "Verificar se ainda ha tempo para submissao", status: dias > 3 ? "pass" : dias > 0 ? "warn" : "fail", detail: dias > 0 ? `${dias} dias restantes` : "Prazo vencido!" });
    }

    const timeline = edital.timeline || [];
    const totalT = timeline.reduce((s: number, d: any) => s + (Array.isArray(d.tasks) ? d.tasks.length : 0), 0); // eslint-disable-line @typescript-eslint/no-explicit-any
    const doneT = timeline.reduce((s: number, d: any) => s + (Array.isArray(d.tasks) ? d.tasks.filter((t: any) => t.done).length : 0), 0); // eslint-disable-line @typescript-eslint/no-explicit-any
    results.push({ id: "timeline", label: "Tarefas da timeline", description: "Progresso nas tarefas planejadas", status: totalT === 0 ? "warn" : doneT === totalT ? "pass" : doneT > totalT * 0.5 ? "warn" : "fail", detail: totalT === 0 ? "Nenhuma tarefa configurada" : `${doneT}/${totalT} concluidas` });

    return results;
  }, [edital]);

  const passCount = checks.filter((c) => c.status === "pass").length;
  const allPass = passCount === checks.length;

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === "pass") return <CheckCircle2 className="w-5 h-5 text-green-400" />;
    if (status === "warn") return <AlertTriangle className="w-5 h-5 text-amber-400" />;
    return <XCircle className="w-5 h-5 text-red-400" />;
  };

  return (
    <div className="space-y-6">
      <div className={`rounded-xl border p-6 text-center ${allPass ? "border-green-600/30 bg-green-600/5" : "border-navy-700 bg-navy-900"}`}>
        <div className={`text-4xl font-bold mb-2 ${allPass ? "text-green-400" : "text-amber-400"}`}>{passCount}/{checks.length}</div>
        <p className="text-sm text-neutral-400">{allPass ? "Tudo pronto para submissao!" : "Ainda ha itens a resolver antes de submeter"}</p>
        {allPass && <Badge variant="success" className="mt-3">Pronto para submeter</Badge>}
      </div>

      <div className="rounded-xl border border-navy-700 bg-navy-900 divide-y divide-navy-800">
        {checks.map((check) => (
          <div key={check.id} className="px-4 py-4 flex items-start gap-3">
            <StatusIcon status={check.status} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-white">{check.label}</h4>
                <Badge variant={check.status === "pass" ? "success" : check.status === "warn" ? "warning" : "destructive"} className="text-xs">{check.status === "pass" ? "OK" : check.status === "warn" ? "Atencao" : "Falha"}</Badge>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">{check.description}</p>
              <p className="text-xs text-neutral-400 mt-1">{check.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Button size="lg" disabled={!allPass}>Exportar PDF da Proposta</Button>
        {!allPass && <p className="text-xs text-neutral-500 mt-2">Resolva todos os itens acima para exportar</p>}
      </div>
    </div>
  );
}
