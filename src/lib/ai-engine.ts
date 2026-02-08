import { getKeywordsForCriterio } from "./text-utils";
import { hasAccents } from "./utils";

// ============================================================
// AI Engine - Port from aprova.html var AI = {...}
// 12 layers of intelligence for edital candidacy
// ============================================================

export interface TextAnalysisResult {
  score: number;
  chars: number;
  pct: number;
  keywords: { found: string[]; missing: string[] };
  issues: string[];
  grade: "A" | "B" | "C" | "D" | "F";
}

export interface RiskItem {
  level: "low" | "medium" | "high" | "critical";
  area: string;
  msg: string;
}

export interface BudgetAnalysis {
  total: number;
  target: number;
  diff: number;
  balanced: boolean;
  items: { nome: string; valor: number; pct: number }[];
  maxItem: { nome: string; valor: number; pct: number };
  concentration: number;
  issues: string[];
}

export interface SocialPlanPost {
  tipo: string;
  desc: string;
  hashtags: string;
}

export interface SocialPlan {
  plataforma: string;
  postsAlvo: number;
  posts: SocialPlanPost[];
}

// Layer 1: Extract keywords from criterion description
export function extractKeywords(criterioCode: string, criterioNome?: string, criterioDica?: string): string[] {
  // First try the static map
  const staticKws = getKeywordsForCriterio(criterioCode);
  if (staticKws.length > 0 && !criterioNome) return staticKws;

  // If we have criterion text, extract dynamic keywords
  if (criterioNome || criterioDica) {
    const text = `${criterioNome || ""} ${criterioDica || ""}`.toLowerCase();
    const stopwords = [
      "de", "do", "da", "dos", "das", "e", "a", "o", "em", "para", "com",
      "que", "no", "na", "por", "ao", "se", "os", "as", "um", "uma", "ou",
      "entre", "sobre", "sua", "seu", "mais", "como",
    ];
    const words = text
      .split(/\s+/)
      .filter((w) => w.length > 3 && !stopwords.includes(w));
    const unique = [...new Set(words)];
    return [...new Set([...staticKws, ...unique])];
  }

  return staticKws;
}

// Layer 2: Analyze text quality for a campo (enhanced version)
export function analyzeTextFull(
  text: string,
  keywords: string[],
  maxChars: number = 8000
): TextAnalysisResult {
  if (!text || text.trim().length === 0) {
    return { score: 0, chars: 0, pct: 0, keywords: { found: [], missing: keywords }, issues: ["Campo vazio"], grade: "F" };
  }

  const len = text.length;
  const pct = Math.round((len / maxChars) * 100);
  const lower = text.toLowerCase();
  const found = keywords.filter((k) => lower.includes(k.toLowerCase()));
  const missing = keywords.filter((k) => !lower.includes(k.toLowerCase()));

  const issues: string[] = [];
  if (len < 3000) issues.push("Texto muito curto (min recomendado: 5.000 chars)");
  if (len > maxChars) issues.push(`EXCEDE LIMITE de ${maxChars} caracteres!`);
  if (hasAccents(text)) issues.push("Contem acentos! Plataforma pode rejeitar");
  if (text.split("\n").length < 5) issues.push("Poucos paragrafos - estruture melhor");
  if (!/\d/.test(text)) issues.push("Sem numeros/dados quantitativos");

  const paragraphs = text.split("\n\n").filter((p) => p.trim().length > 0);
  if (paragraphs.length < 3) issues.push("Menos de 3 blocos de conteudo");

  const kwScore = keywords.length > 0 ? Math.round((found.length / keywords.length) * 100) : 50;
  const lenScore = len >= 5000 ? 100 : len >= 3000 ? 70 : len >= 1000 ? 40 : 10;
  const structScore = paragraphs.length >= 5 ? 100 : paragraphs.length >= 3 ? 70 : 30;
  const issuesPenalty = Math.min(issues.length * 15, 50);

  const total = Math.max(0, Math.min(100, Math.round(kwScore * 0.35 + lenScore * 0.35 + structScore * 0.3 - issuesPenalty)));
  const grade: TextAnalysisResult["grade"] =
    total >= 85 ? "A" : total >= 70 ? "B" : total >= 50 ? "C" : total >= 30 ? "D" : "F";

  return { score: total, chars: len, pct, keywords: { found, missing }, issues, grade };
}

// Layer 3: Predict score (0/3/5/7/10) for a campo based on text analysis
export function predictFieldScore(analysisScore: number): 0 | 3 | 5 | 7 | 10 {
  if (analysisScore >= 85) return 10;
  if (analysisScore >= 70) return 7;
  if (analysisScore >= 50) return 5;
  if (analysisScore >= 25) return 3;
  return 0;
}

// Layer 4: Predict total score across all campos
export function predictTotalScore(
  campos: { conteudo?: string | null; criterioId?: string | null; maxChars: number }[],
  orcamentoBalanced: boolean
): number {
  let total = 0;

  campos.forEach((campo) => {
    const text = campo.conteudo || "";
    const keywords = extractKeywords(campo.criterioId || "");
    const analysis = analyzeTextFull(text, keywords, campo.maxChars);
    total += predictFieldScore(analysis.score);
  });

  // Criteria without text fields (e=orcamento, i=viabilidade) estimated
  total += orcamentoBalanced ? 7 : 3; // e) Orcamento
  total += 7; // i) Viabilidade (assume good if other criteria ok)

  return Math.min(100, total);
}

// Layer 5: Generate smart prompt for a campo
export function generatePrompt(
  campoNome: string,
  criterioNome: string,
  criterioDica: string,
  editalNome: string,
  editalValor: number,
  candidatoNome: string,
  candidatoCidade: string,
  candidatoArea: string,
  candidatoEmpresa: string,
  restricoes: string[],
  maxChars: number = 8000
): string {
  return (
    `Voce e um consultor especialista em editais culturais brasileiros.\n\n` +
    `EDITAL: ${editalNome}\nVALOR: R$ ${editalValor.toLocaleString("pt-BR")}\n` +
    `CANDIDATO: ${candidatoNome} (${candidatoCidade})\n` +
    `EMPRESA: ${candidatoEmpresa || "N/A"}\nAREA: ${candidatoArea}\n\n` +
    `CAMPO: ${campoNome}\nCRITERIO AVALIADO: ${criterioNome}: ${criterioDica}\n` +
    `LIMITE: ${maxChars} caracteres (OBRIGATORIO respeitar)\n\n` +
    `RESTRICOES:\n- SEM acentos (plataforma nao aceita)\n- SEM caracteres especiais\n- Linguagem clara e objetiva\n- Evidenciar alinhamento com o criterio\n` +
    (restricoes.length > 0 ? `- Restricoes do edital: ${restricoes.join("; ")}\n` : "") +
    `\nESCREVA o texto completo para este campo, entre 5.000 e ${maxChars} caracteres. ` +
    `Foque em demonstrar ${criterioNome}. Use dados quantitativos sempre que possivel.`
  );
}

// Layer 7: Analyze budget balance
export function analyzeBudget(
  items: { nome: string; valor: number }[],
  valorTotal: number
): BudgetAnalysis {
  const total = items.reduce((s, i) => s + i.valor, 0);
  const mapped = items.map((it) => ({
    nome: it.nome,
    valor: it.valor,
    pct: total > 0 ? Math.round((it.valor / total) * 100) : 0,
  }));
  const diff = valorTotal - total;
  const maxItem = mapped.reduce((a, b) => (a.valor > b.valor ? a : b), { nome: "", valor: 0, pct: 0 });
  const issues: string[] = [];
  if (Math.abs(diff) > 0.01) {
    issues.push(`Orcamento ${diff > 0 ? "abaixo" : "acima"} do alvo em R$ ${Math.abs(diff).toLocaleString("pt-BR")}`);
  }
  if (maxItem.pct > 50) {
    issues.push(`Item "${maxItem.nome}" concentra ${maxItem.pct}% do orcamento`);
  }

  return {
    total,
    target: valorTotal,
    diff,
    balanced: Math.abs(diff) < 0.01,
    items: mapped,
    maxItem,
    concentration: maxItem.pct,
    issues,
  };
}

// Layer 9: Analyze risks
export function analyzeRisks(
  prazo: Date | string | null,
  campos: { conteudo?: string | null; criterioId?: string | null; maxChars: number }[],
  orcamentoItems: { nome: string; valor: number }[],
  valorTotal: number
): RiskItem[] {
  const risks: RiskItem[] = [];

  // Deadline risk
  if (prazo) {
    const prazoDate = typeof prazo === "string" ? new Date(prazo) : prazo;
    const daysLeft = Math.ceil((prazoDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 0) risks.push({ level: "critical", area: "Prazo", msg: "PRAZO EXPIRADO!" });
    else if (daysLeft <= 3) risks.push({ level: "high", area: "Prazo", msg: `Apenas ${daysLeft} dias restantes!` });
    else if (daysLeft <= 7) risks.push({ level: "medium", area: "Prazo", msg: `${daysLeft} dias restantes` });
    else risks.push({ level: "low", area: "Prazo", msg: `${daysLeft} dias restantes` });
  }

  // Text completion risk
  const emptyTexts = campos.filter((c) => !(c.conteudo || "").trim()).length;
  if (emptyTexts > 0) {
    risks.push({
      level: emptyTexts > 4 ? "high" : "medium",
      area: "Textos",
      msg: `${emptyTexts} de ${campos.length} textos vazios`,
    });
  } else {
    risks.push({ level: "low", area: "Textos", msg: "Todos textos preenchidos" });
  }

  // Budget risk
  const bud = analyzeBudget(orcamentoItems, valorTotal);
  if (!bud.balanced) {
    risks.push({
      level: "high",
      area: "Orcamento",
      msg: `Diferenca de R$ ${Math.abs(bud.diff).toLocaleString("pt-BR")}`,
    });
  } else {
    risks.push({ level: "low", area: "Orcamento", msg: `Exatamente R$ ${bud.target.toLocaleString("pt-BR")}` });
  }

  // Score risk
  const predicted = predictTotalScore(campos, bud.balanced);
  if (predicted < 40) {
    risks.push({ level: "critical", area: "Pontuacao", msg: `Score predito: ${predicted} (abaixo do corte 40!)` });
  } else if (predicted < 60) {
    risks.push({ level: "medium", area: "Pontuacao", msg: `Score predito: ${predicted}` });
  } else {
    risks.push({ level: "low", area: "Pontuacao", msg: `Score predito: ${predicted} pts` });
  }

  return risks;
}

// Layer 10: Generate social media plan
export function generateSocialPlan(totalPosts: number = 20): SocialPlan {
  const categories = [
    { tipo: "Portfolio", pct: 0.4, desc: "Mostrar trabalhos realizados" },
    { tipo: "Bastidores", pct: 0.2, desc: "Processo criativo e equipe" },
    { tipo: "Depoimentos", pct: 0.15, desc: "Clientes e parceiros" },
    { tipo: "Formacao", pct: 0.1, desc: "Certificados e cursos" },
    { tipo: "Engajamento", pct: 0.15, desc: "Perguntas, enquetes, call-to-action" },
  ];

  const posts: SocialPlanPost[] = [];
  categories.forEach((cat) => {
    const n = Math.max(1, Math.round(totalPosts * cat.pct));
    for (let i = 0; i < n; i++) {
      posts.push({
        tipo: cat.tipo,
        desc: cat.desc,
        hashtags: "#cultura #edital #producaocultural #aldirBlanc #pernambuco",
      });
    }
  });

  return {
    plataforma: "Instagram",
    postsAlvo: totalPosts,
    posts: posts.slice(0, totalPosts),
  };
}
