"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Upload, Wand2, Zap, FileText, Target, DollarSign, CheckCircle2 } from "lucide-react";

interface WizardData {
  nome: string;
  orgao: string;
  tipo: string;
  valor: string;
  prazo: string;
  plataforma: string;
  candidatoNome: string;
  candidatoCpf: string;
  candidatoCidade: string;
  candidatoArea: string;
  cotas: string[];
}

interface ParseResult {
  meta?: { nome?: string; orgao?: string; valor?: number; prazo?: string; plataforma?: string };
  campos?: { nome: string; curto?: string; maxChars?: number; placeholder?: string }[];
  criterios?: { codigo: string; nome: string; dica?: string; peso?: number; escala?: number[] }[];
  bonus?: { nome: string; pontos: number; descricao?: string }[];
  restricoes?: string[];
  orcamento_sugerido?: { nome: string; valor: number }[];
  timeline?: { dia: number; titulo: string; emoji?: string; tasks?: string[] }[];
}

const STEPS = ["Edital", "Candidato", "Campos", "Orcamento", "Revisao"];

export default function NovoEditalPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [creatingFromParse, setCreatingFromParse] = useState(false);
  const [data, setData] = useState<WizardData>({
    nome: "", orgao: "", tipo: "cultural", valor: "", prazo: "", plataforma: "",
    candidatoNome: "", candidatoCpf: "", candidatoCidade: "", candidatoArea: "", cotas: [],
  });
  const router = useRouter();

  function updateField(field: keyof WizardData, value: string | string[]) {
    setData((prev) => ({ ...prev, [field]: value }));
  }

  async function handlePDFUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadLoading(true);
    setParseResult(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/ai/parse-pdf", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Erro ao processar PDF");
      const config: ParseResult = await res.json();
      setParseResult(config);
      if (config.meta) {
        setData((prev) => ({
          ...prev,
          nome: config.meta!.nome || prev.nome,
          orgao: config.meta!.orgao || prev.orgao,
          valor: config.meta!.valor?.toString() || prev.valor,
          prazo: config.meta!.prazo || prev.prazo,
          plataforma: config.meta!.plataforma || prev.plataforma,
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploadLoading(false);
    }
  }

  async function handleCreateFromParse() {
    if (!parseResult) return;
    setCreatingFromParse(true);
    try {
      const payload = {
        ...parseResult,
        meta: {
          ...parseResult.meta,
          nome: data.nome || parseResult.meta?.nome || "Edital sem nome",
          orgao: data.orgao || parseResult.meta?.orgao,
          valor: parseFloat(data.valor) || parseResult.meta?.valor || 0,
          prazo: data.prazo || parseResult.meta?.prazo,
          plataforma: data.plataforma || parseResult.meta?.plataforma,
        },
        candidato: data.candidatoNome ? {
          nome: data.candidatoNome,
          cidade: data.candidatoCidade || undefined,
          area: data.candidatoArea || undefined,
          cotas: data.cotas.length > 0 ? data.cotas : undefined,
        } : undefined,
      };

      const res = await fetch("/api/editais/create-from-parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Erro ao criar edital");
      const edital = await res.json();
      router.push(`/dashboard/editais/${edital.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setCreatingFromParse(false);
    }
  }

  async function handleCreate() {
    setLoading(true);
    try {
      const res = await fetch("/api/editais", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: data.nome, orgao: data.orgao, tipo: data.tipo,
          valor: parseFloat(data.valor) || 0, prazo: data.prazo || undefined, plataforma: data.plataforma,
        }),
      });
      if (!res.ok) throw new Error("Erro ao criar edital");
      const edital = await res.json();
      router.push(`/dashboard/editais/${edital.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function toggleCota(cota: string) {
    setData((prev) => ({
      ...prev,
      cotas: prev.cotas.includes(cota) ? prev.cotas.filter((c) => c !== cota) : [...prev.cotas, cota],
    }));
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-2">Novo Edital</h1>
      <p className="text-sm text-neutral-400 mb-8">Preencha as informacoes do edital em {STEPS.length} passos</p>

      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${i <= step ? "bg-royal text-white" : "bg-navy-800 text-neutral-500"}`}>
              {i + 1}
            </div>
            <span className={`text-xs hidden sm:inline ${i <= step ? "text-white" : "text-neutral-500"}`}>{s}</span>
            {i < STEPS.length - 1 && <div className="flex-1 h-px bg-navy-700" />}
          </div>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          {step === 0 && (
            <div className="space-y-4">
              <div className="rounded-lg border border-dashed border-navy-600 p-6 text-center mb-6">
                <Upload className="w-8 h-8 text-neutral-500 mx-auto mb-2" />
                <p className="text-sm text-neutral-400 mb-3">Tem o PDF do edital? Envie para preenchimento automatico com IA</p>
                <label className="inline-flex items-center gap-2 bg-navy-700 text-neutral-300 px-4 py-2 rounded-lg cursor-pointer hover:bg-navy-600 text-sm">
                  <Wand2 className="w-4 h-4" />
                  {uploadLoading ? "Processando..." : "Enviar PDF"}
                  <input type="file" accept=".pdf" className="hidden" onChange={handlePDFUpload} disabled={uploadLoading} />
                </label>
              </div>

              {/* Parse Preview */}
              {parseResult && (
                <div className="rounded-lg bg-green-500/10 border border-green-500/30 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="text-sm font-semibold text-green-400">PDF analisado com sucesso!</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1 text-neutral-300">
                      <FileText className="w-3 h-3 text-neutral-500" />
                      {parseResult.campos?.length || 0} campos
                    </div>
                    <div className="flex items-center gap-1 text-neutral-300">
                      <Target className="w-3 h-3 text-neutral-500" />
                      {parseResult.criterios?.length || 0} criterios
                    </div>
                    <div className="flex items-center gap-1 text-neutral-300">
                      <DollarSign className="w-3 h-3 text-neutral-500" />
                      {parseResult.orcamento_sugerido?.length || 0} itens orcamento
                    </div>
                    <div className="flex items-center gap-1 text-neutral-300">
                      <Zap className="w-3 h-3 text-neutral-500" />
                      {parseResult.bonus?.length || 0} bonus
                    </div>
                  </div>

                  {parseResult.restricoes && parseResult.restricoes.length > 0 && (
                    <div className="text-xs text-neutral-400">
                      {parseResult.restricoes.length} restricao(oes) identificada(s)
                    </div>
                  )}

                  <Button
                    onClick={handleCreateFromParse}
                    disabled={creatingFromParse}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Zap className="w-4 h-4" />
                    {creatingFromParse ? "Criando..." : "Criar Edital Completo do PDF"}
                  </Button>

                  <p className="text-[10px] text-neutral-500 text-center">
                    Ou continue preenchendo manualmente abaixo
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label>Nome do edital *</Label>
                <Input placeholder="Ex: Edital 003/2026 - Lei Aldir Blanc PE" value={data.nome} onChange={(e) => updateField("nome", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Orgao/Instituicao</Label>
                <Input placeholder="Ex: Secretaria de Cultura de PE" value={data.orgao} onChange={(e) => updateField("orgao", e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Valor (R$) *</Label>
                  <Input type="number" placeholder="30000" value={data.valor} onChange={(e) => updateField("valor", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Prazo</Label>
                  <Input type="date" value={data.prazo} onChange={(e) => updateField("prazo", e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Plataforma de submissao</Label>
                <Input placeholder="Ex: mapacultural.pe.gov.br" value={data.plataforma} onChange={(e) => updateField("plataforma", e.target.value)} />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nome do candidato *</Label>
                <Input placeholder="Nome completo" value={data.candidatoNome} onChange={(e) => updateField("candidatoNome", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>CPF</Label>
                <Input placeholder="000.000.000-00" value={data.candidatoCpf} onChange={(e) => updateField("candidatoCpf", e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cidade</Label>
                  <Input placeholder="Ex: Caruaru" value={data.candidatoCidade} onChange={(e) => updateField("candidatoCidade", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Area cultural</Label>
                  <Input placeholder="Ex: Musica, Teatro" value={data.candidatoArea} onChange={(e) => updateField("candidatoArea", e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Cotas (se aplicavel)</Label>
                <div className="flex flex-wrap gap-2">
                  {["PCD", "Negro(a)", "Indigena", "LGBTQIA+", "Mulher", "Idoso"].map((cota) => (
                    <button key={cota} type="button" onClick={() => toggleCota(cota)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${data.cotas.includes(cota) ? "bg-royal text-white" : "bg-navy-800 text-neutral-400 hover:bg-navy-700"}`}>
                      {cota}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="rounded-lg bg-navy-800/50 p-4">
              <h3 className="text-sm font-medium text-white mb-2">Campos de texto</h3>
              <p className="text-xs text-neutral-400 mb-4">Os campos padrao para editais culturais serao criados automaticamente.</p>
              <div className="space-y-2">
                {["Objeto da Proposta", "Oportunidades Geradas", "Trajetoria Cultural", "Resultados e Metas", "Sustentabilidade", "Justificativa", "Emprego e Renda", "Valor Social"].map((campo, i) => (
                  <div key={campo} className="flex items-center gap-3 text-sm">
                    <div className="w-6 h-6 rounded bg-navy-700 flex items-center justify-center text-xs text-neutral-400">{i + 1}</div>
                    <span className="text-neutral-300">{campo}</span>
                    <span className="text-xs text-neutral-500 ml-auto">8.000 chars</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="rounded-lg bg-navy-800/50 p-4">
              <h3 className="text-sm font-medium text-white mb-2">Orcamento</h3>
              <p className="text-xs text-neutral-400">O orcamento sera configurado depois com a calculadora interativa. O valor total deve ser igual a {data.valor ? `R$ ${parseFloat(data.valor).toLocaleString("pt-BR")}` : "o valor do edital"}.</p>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3 text-sm">
              <h3 className="text-sm font-medium text-white mb-4">Confirme os dados</h3>
              {[
                ["Edital", data.nome],
                ["Orgao", data.orgao],
                ["Valor", data.valor ? `R$ ${parseFloat(data.valor).toLocaleString("pt-BR")}` : ""],
                ["Prazo", data.prazo],
                ["Candidato", data.candidatoNome],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-2 border-b border-navy-800">
                  <span className="text-neutral-400">{label}</span>
                  <span className="text-white">{value || "\u2014"}</span>
                </div>
              ))}
              {data.cotas.length > 0 && (
                <div className="flex justify-between py-2 border-b border-navy-800">
                  <span className="text-neutral-400">Cotas</span>
                  <span className="text-white">{data.cotas.join(", ")}</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={() => setStep((s) => s - 1)} disabled={step === 0}>
          <ChevronLeft className="w-4 h-4" /> Voltar
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep((s) => s + 1)}>
            Proximo <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button onClick={handleCreate} disabled={loading || !data.nome || !data.valor}>
            {loading ? "Criando..." : "Criar Edital"}
          </Button>
        )}
      </div>
    </div>
  );
}
