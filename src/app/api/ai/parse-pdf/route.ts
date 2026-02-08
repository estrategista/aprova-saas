import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file || file.type !== "application/pdf") {
    return NextResponse.json({ error: "PDF obrigatorio" }, { status: 400 });
  }

  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "API key nao configurada" },
      { status: 400 }
    );
  }

  try {
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 8192,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "document",
              source: {
                type: "base64",
                media_type: "application/pdf",
                data: base64,
              },
            },
            {
              type: "text",
              text: `Analise este edital cultural brasileiro e extraia TODAS as informacoes em formato JSON.

INSTRUCOES DETALHADAS:
1. **meta**: Informacoes basicas do edital
2. **campos**: Cada campo de texto que o candidato precisa preencher (formulario da proposta)
3. **criterios**: Cada criterio de avaliacao com codigo (a, b, c...), nome, dica de como pontuar, peso e escala de notas
4. **bonus**: Pontuacoes extras (inducao, cotas, pertencimento, territorio, etc)
5. **restricoes**: Regras, limites e proibicoes do edital
6. **orcamento_sugerido**: Se o edital lista categorias de despesa, sugira itens de orcamento
7. **timeline**: Se houver cronograma ou etapas, liste com dia (sequencial), titulo e tarefas

FORMATO JSON OBRIGATORIO:
{
  "meta": {
    "nome": "Nome completo do edital",
    "orgao": "Orgao responsavel",
    "tipo": "cultural",
    "valor": 30000,
    "prazo": "2026-03-15",
    "plataforma": "URL ou nome da plataforma de submissao"
  },
  "campos": [
    { "nome": "Nome do campo", "curto": "Abreviacao", "maxChars": 8000, "placeholder": "Dica do que escrever" }
  ],
  "criterios": [
    { "codigo": "a", "nome": "Nome do criterio", "dica": "Como pontuar bem neste criterio", "peso": 10, "escala": [0,3,5,7,10] }
  ],
  "bonus": [
    { "nome": "Nome do bonus", "pontos": 15, "descricao": "Condicao para receber" }
  ],
  "restricoes": ["Restricao 1", "Restricao 2"],
  "orcamento_sugerido": [
    { "nome": "Categoria", "valor": 5000 }
  ],
  "timeline": [
    { "dia": 1, "titulo": "Etapa 1", "emoji": "📋", "tasks": ["Tarefa 1", "Tarefa 2"] }
  ]
}

REGRAS:
- Se o edital nao menciona um campo especifico, use os 8 campos padrao de editais culturais brasileiros: Objeto, Oportunidades, Trajetoria, Resultados, Sustentabilidade, Justificativa, Emprego e Renda, Valor Social
- Se nao houver criterios explicitos, infira a partir dos campos
- Valores monetarios sempre em numeros (sem R$)
- Datas em formato YYYY-MM-DD
- Retorne APENAS o JSON valido, sem markdown ou explicacoes`,
            },
          ],
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "{}";

    let config;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      config = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);
    } catch {
      return NextResponse.json(
        { error: "Nao foi possivel parsear o edital. Tente novamente." },
        { status: 422 }
      );
    }

    return NextResponse.json(config);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Erro ao processar PDF";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
