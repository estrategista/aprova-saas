import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Anthropic from "@anthropic-ai/sdk";
import { generatePrompt } from "@/lib/ai-engine";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
  }

  const { prompt, campo, criterio, editalId } = await req.json();

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  const apiKey = user?.claudeApiKey || process.env.CLAUDE_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "API key nao configurada. Configure em Configuracoes ou contate o administrador." },
      { status: 400 }
    );
  }

  // Fetch edital context if editalId provided
  let editalContext = null;
  if (editalId) {
    editalContext = await prisma.edital.findUnique({
      where: { id: editalId },
      include: {
        candidato: true,
        campos: { where: criterio ? { criterioId: criterio } : undefined },
        criterios: { where: criterio ? { codigo: criterio } : undefined },
      },
    });
  }

  try {
    const client = new Anthropic({ apiKey });

    // Generate contextual prompt using ai-engine if we have edital context
    let userPrompt = prompt;
    if (!userPrompt && editalContext) {
      const criterioData = editalContext.criterios[0];
      userPrompt = generatePrompt(
        campo || editalContext.campos[0]?.nome || "Campo",
        criterioData?.nome || criterio || "Criterio",
        criterioData?.dica || "",
        editalContext.nome,
        editalContext.valor,
        editalContext.candidato?.nome || user?.name || "Candidato",
        editalContext.candidato?.cidade || user?.cidade || "",
        editalContext.candidato?.area || user?.area || "Cultura",
        editalContext.candidato?.empresa || "",
        editalContext.restricoes || [],
        editalContext.campos[0]?.maxChars || 8000
      );
    } else if (!userPrompt) {
      userPrompt = `Escreva um texto para o campo "${campo}" de um edital cultural. Criterio de avaliacao: ${criterio}. Maximo 8000 caracteres, SEM acentos.`;
    }

    const systemPrompt = `Voce e um especialista em editais culturais brasileiros. Ajude a escrever textos para candidaturas a editais.
REGRAS CRITICAS:
- NAO use acentos (a plataforma nao aceita)
- Maximo 8000 caracteres
- Escreva em portugues brasileiro SEM acentos
- Seja objetivo e tecnico
- Use palavras-chave relevantes para o criterio de avaliacao
- Inclua dados quantitativos e exemplos concretos sempre que possivel
- Estruture em paragrafos claros com titulos em CAIXA ALTA`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({ text });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Erro ao gerar texto";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
