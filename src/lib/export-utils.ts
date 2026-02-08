import { removeAccents } from "./utils";

export function sanitizeForPlatform(text: string): string {
  let clean = removeAccents(text);
  // Remove smart quotes and other problematic chars
  clean = clean.replace(/[\u2018\u2019]/g, "'");
  clean = clean.replace(/[\u201C\u201D]/g, '"');
  clean = clean.replace(/\u2014/g, " - ");
  clean = clean.replace(/\u2013/g, " - ");
  clean = clean.replace(/\u2026/g, "...");
  return clean;
}

interface ExportValidation {
  valid: boolean;
  issues: string[];
  warnings: string[];
}

export function validateExport(
  campos: { nome: string; conteudo?: string | null; maxChars: number }[],
  orcamento: { nome: string; valor: number }[],
  valorTotal: number,
  candidatoNome?: string | null
): ExportValidation {
  const issues: string[] = [];
  const warnings: string[] = [];

  // Check campos
  const empty = campos.filter((c) => !(c.conteudo || "").trim());
  if (empty.length > 0) {
    issues.push(`${empty.length} campo(s) vazio(s): ${empty.map((c) => c.nome).join(", ")}`);
  }

  // Check char limits
  campos.forEach((c) => {
    const len = (c.conteudo || "").length;
    if (len > c.maxChars) {
      issues.push(`"${c.nome}" excede o limite em ${len - c.maxChars} chars`);
    }
  });

  // Check accents
  campos.forEach((c) => {
    const text = c.conteudo || "";
    const sanitized = removeAccents(text);
    if (text !== sanitized) {
      warnings.push(`"${c.nome}" contem acentos (serao removidos na exportacao)`);
    }
  });

  // Check budget
  const budgetTotal = orcamento.reduce((s, i) => s + i.valor, 0);
  if (Math.abs(budgetTotal - valorTotal) > 0.01) {
    issues.push(`Orcamento (R$ ${budgetTotal.toLocaleString("pt-BR")}) diferente do valor do edital (R$ ${valorTotal.toLocaleString("pt-BR")})`);
  }

  // Check candidato
  if (!candidatoNome) {
    warnings.push("Nome do candidato nao preenchido");
  }

  return {
    valid: issues.length === 0,
    issues,
    warnings,
  };
}
