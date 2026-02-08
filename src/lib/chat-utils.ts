interface EditalForChat {
  nome: string;
  orgao?: string | null;
  valor: number;
  prazo?: string | Date | null;
  plataforma?: string | null;
  candidato?: {
    nome: string;
    cidade?: string | null;
    area?: string | null;
    cotas?: string[];
  } | null;
  campos: {
    nome: string;
    curto?: string | null;
    conteudo?: string | null;
    maxChars: number;
  }[];
  criterios: {
    codigo: string;
    nome: string;
    dica?: string | null;
    peso: number;
  }[];
  orcamento: {
    nome: string;
    valor: number;
  }[];
  bonus?: {
    nome: string;
    pontos: number;
    ativo: boolean;
  }[];
}

export function buildChatContext(edital: EditalForChat): string {
  const orcTotal = edital.orcamento.reduce((s, i) => s + i.valor, 0);
  const camposStatus = edital.campos.map((c) => {
    const len = (c.conteudo || "").length;
    const pct = Math.round((len / c.maxChars) * 100);
    return `- ${c.curto || c.nome}: ${len > 0 ? `${len} chars (${pct}%)` : "VAZIO"}`;
  }).join("\n");

  const criteriosList = edital.criterios.map((c) =>
    `- ${c.codigo}) ${c.nome} (peso ${c.peso})${c.dica ? `: ${c.dica.slice(0, 200)}` : ""}`
  ).join("\n");

  const orcList = edital.orcamento.map((i) =>
    `- ${i.nome}: R$ ${i.valor.toLocaleString("pt-BR")}`
  ).join("\n");

  const bonusActive = (edital.bonus || []).filter((b) => b.ativo);
  const bonusStr = bonusActive.length > 0
    ? bonusActive.map((b) => `- ${b.nome}: +${b.pontos} pts`).join("\n")
    : "Nenhum bonus ativo";

  const prazoStr = edital.prazo
    ? (() => {
        const d = typeof edital.prazo === "string" ? new Date(edital.prazo) : edital.prazo;
        const days = Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        return `${d.toLocaleDateString("pt-BR")} (${days > 0 ? `${days} dias restantes` : "EXPIRADO"})`;
      })()
    : "Nao definido";

  return `Voce e um consultor especialista em editais culturais brasileiros, especialmente da Lei Aldir Blanc e Paulo Gustavo.

CONTEXTO DO EDITAL:
- Nome: ${edital.nome}
- Orgao: ${edital.orgao || "N/A"}
- Valor: R$ ${edital.valor.toLocaleString("pt-BR")}
- Prazo: ${prazoStr}
- Plataforma: ${edital.plataforma || "N/A"}

CANDIDATO:
- Nome: ${edital.candidato?.nome || "N/A"}
- Cidade: ${edital.candidato?.cidade || "N/A"}
- Area: ${edital.candidato?.area || "N/A"}
- Cotas: ${edital.candidato?.cotas?.join(", ") || "Nenhuma"}

STATUS DOS TEXTOS:
${camposStatus}

CRITERIOS DE AVALIACAO (escala 0/3/5/7/10):
${criteriosList}

ORCAMENTO (R$ ${orcTotal.toLocaleString("pt-BR")} de R$ ${edital.valor.toLocaleString("pt-BR")}):
${orcList}

BONUS DE INDUCAO:
${bonusStr}

REGRAS:
- NAO use acentos nas respostas (plataforma nao aceita)
- Seja especifico sobre ESTE edital e ESTE candidato
- Quando sugerir textos, respeite o limite de 8.000 chars por campo
- Foque em maximizar a pontuacao nos criterios de avaliacao
- Responda de forma objetiva e acionavel`;
}
