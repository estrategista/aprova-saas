import { hasAccents } from "./utils";

export function analyzeText(
  text: string,
  keywords: string[],
  maxChars: number
) {
  const charCount = text.length;
  const charPercent = Math.round((charCount / maxChars) * 100);
  const textHasAccents = hasAccents(text);

  const normalized = text.normalize("NFD");
  const accentCount = (normalized.match(/[\u0300-\u036f]/g) || []).length;

  const lower = text.toLowerCase();
  const keywordsFound = keywords.filter((k) => lower.includes(k.toLowerCase()));
  const keywordsMissing = keywords.filter((k) => !lower.includes(k.toLowerCase()));

  let score = 0;

  if (charPercent >= 70) score += 3;
  else if (charPercent >= 40) score += 2;
  else if (charPercent >= 20) score += 1;

  const kwPercent = keywords.length > 0 ? keywordsFound.length / keywords.length : 1;
  score += Math.round(kwPercent * 4);

  const paragraphs = text.split(/\n\n+/).filter((p) => p.trim().length > 0);
  if (paragraphs.length >= 3) score += 2;
  else if (paragraphs.length >= 2) score += 1;

  if (!textHasAccents && charCount > 0) score += 1;

  const suggestions: string[] = [];
  if (charPercent < 40) suggestions.push("Texto muito curto. Tente preencher pelo menos 60% do espaco disponivel.");
  if (textHasAccents) suggestions.push(`Encontrados ${accentCount} caracteres com acentos. A plataforma pode nao aceitar acentos.`);
  if (keywordsMissing.length > 0) suggestions.push(`Palavras-chave ausentes: ${keywordsMissing.join(", ")}`);
  if (paragraphs.length < 3) suggestions.push("Organize o texto em pelo menos 3 paragrafos para melhor estrutura.");

  return {
    score: Math.min(score, 10),
    charCount,
    charPercent,
    hasAccents: textHasAccents,
    accentCount,
    keywordsFound,
    keywordsMissing,
    suggestions,
  };
}

export function predictScore(fieldScore: number): 0 | 3 | 5 | 7 | 10 {
  if (fieldScore >= 9) return 10;
  if (fieldScore >= 7) return 7;
  if (fieldScore >= 5) return 5;
  if (fieldScore >= 3) return 3;
  return 0;
}

export function getKeywordsForCriterio(codigo: string): string[] {
  const keywordMap: Record<string, string[]> = {
    a: ["objetivo", "proposta", "projeto", "cultural", "arte", "impacto", "comunidade"],
    b: ["oportunidade", "potencial", "publico", "alcance", "beneficiarios", "acesso"],
    c: ["trajetoria", "experiencia", "curriculo", "formacao", "portfolio", "realizacoes"],
    d: ["resultado", "meta", "indicador", "mensuravel", "entrega", "produto"],
    e: ["acessibilidade", "inclusao", "democratizacao", "diversidade"],
    f: ["sustentabilidade", "continuidade", "legado", "longo prazo", "perenidade"],
    g: ["justificativa", "relevancia", "necessidade", "demanda", "contexto"],
    h: ["emprego", "renda", "economia", "profissional", "cadeia produtiva", "trabalho"],
    i: ["inovacao", "criatividade", "originalidade", "experimentacao"],
    j: ["valor social", "transformacao", "impacto social", "territorio", "identidade"],
  };
  return keywordMap[codigo] || [];
}
