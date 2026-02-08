"use client";

import { useState } from "react";
import { Printer, Copy, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sanitizeForPlatform, validateExport } from "@/lib/export-utils";

interface Campo {
  nome: string;
  curto?: string | null;
  conteudo?: string | null;
  maxChars: number;
}

interface OrcItem {
  nome: string;
  valor: number;
  descricao?: string | null;
}

interface ProposalDocumentProps {
  editalNome: string;
  orgao?: string | null;
  valor: number;
  prazo?: string | null;
  candidatoNome?: string | null;
  candidatoCidade?: string | null;
  campos: Campo[];
  orcamento: OrcItem[];
}

export function ProposalDocument({
  editalNome,
  orgao,
  valor,
  prazo,
  candidatoNome,
  candidatoCidade,
  campos,
  orcamento,
}: ProposalDocumentProps) {
  const [copied, setCopied] = useState(false);

  const validation = validateExport(campos, orcamento, valor, candidatoNome);
  const orcTotal = orcamento.reduce((s, i) => s + i.valor, 0);

  function handlePrint() {
    window.print();
  }

  async function handleCopyAll() {
    const sections = campos
      .filter((c) => (c.conteudo || "").trim())
      .map((c) => {
        const title = (c.curto || c.nome).toUpperCase();
        const text = sanitizeForPlatform(c.conteudo || "");
        return `=== ${title} ===\n\n${text}`;
      });

    const fullText = sections.join("\n\n\n");

    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement("textarea");
      el.value = fullText;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  }

  return (
    <div>
      {/* Validation Panel - hidden on print */}
      <div className="print:hidden mb-6">
        {!validation.valid && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-4 h-4 text-red-400" />
              <span className="text-sm font-medium text-red-400">Problemas encontrados</span>
            </div>
            <ul className="space-y-1">
              {validation.issues.map((issue, i) => (
                <li key={i} className="text-xs text-red-300">• {issue}</li>
              ))}
            </ul>
          </div>
        )}
        {validation.warnings.length > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-amber-400">Avisos</span>
            </div>
            <ul className="space-y-1">
              {validation.warnings.map((w, i) => (
                <li key={i} className="text-xs text-amber-300">• {w}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center gap-3">
          <Button onClick={handlePrint} variant="outline" size="sm">
            <Printer className="w-4 h-4" /> Imprimir
          </Button>
          <Button onClick={handleCopyAll} size="sm">
            {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copiado!" : "Copiar Textos"}
          </Button>
        </div>
      </div>

      {/* Printable Document */}
      <div className="bg-white text-black rounded-lg p-8 print:p-0 print:rounded-none print:shadow-none">
        {/* Header */}
        <div className="text-center border-b-2 border-black pb-4 mb-6">
          <h1 className="text-xl font-bold uppercase">{editalNome}</h1>
          {orgao && <p className="text-sm mt-1">{orgao}</p>}
          <div className="flex justify-center gap-6 mt-2 text-xs text-gray-600">
            <span>Valor: R$ {valor.toLocaleString("pt-BR")}</span>
            {prazo && <span>Prazo: {new Date(prazo).toLocaleDateString("pt-BR")}</span>}
          </div>
        </div>

        {/* Candidato */}
        {candidatoNome && (
          <div className="mb-6 text-sm">
            <strong>Proponente:</strong> {candidatoNome}
            {candidatoCidade && <span> — {candidatoCidade}</span>}
          </div>
        )}

        {/* Campos */}
        {campos.map((campo, i) => {
          const text = sanitizeForPlatform(campo.conteudo || "");
          if (!text.trim()) return null;
          return (
            <div key={i} className="mb-6 print:break-inside-avoid">
              <h2 className="text-sm font-bold uppercase border-b border-gray-300 pb-1 mb-2">
                {i + 1}. {campo.curto || campo.nome}
              </h2>
              <div className="text-sm leading-relaxed whitespace-pre-wrap">{text}</div>
              <div className="text-xs text-gray-400 mt-1 print:hidden">
                {text.length.toLocaleString("pt-BR")} / {campo.maxChars.toLocaleString("pt-BR")} caracteres
              </div>
            </div>
          );
        })}

        {/* Orcamento */}
        {orcamento.length > 0 && (
          <div className="mt-8 print:break-before-page">
            <h2 className="text-sm font-bold uppercase border-b border-gray-300 pb-1 mb-3">
              Orcamento
            </h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-1">Item</th>
                  <th className="text-right py-1">Valor</th>
                  <th className="text-right py-1">%</th>
                </tr>
              </thead>
              <tbody>
                {orcamento.map((item, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-1">{item.nome}</td>
                    <td className="text-right py-1">R$ {item.valor.toLocaleString("pt-BR")}</td>
                    <td className="text-right py-1">{orcTotal > 0 ? Math.round((item.valor / orcTotal) * 100) : 0}%</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-black font-bold">
                  <td className="py-1">TOTAL</td>
                  <td className="text-right py-1">R$ {orcTotal.toLocaleString("pt-BR")}</td>
                  <td className="text-right py-1">100%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-4 border-t border-gray-300 text-center text-xs text-gray-400 print:text-gray-600">
          <p>Documento gerado por Aprova.ai — {new Date().toLocaleDateString("pt-BR")}</p>
        </div>
      </div>
    </div>
  );
}
