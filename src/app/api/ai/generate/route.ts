import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
  }

  const { prompt, campo, criterio, editalNome } = await req.json();

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  const apiKey = user?.claudeApiKey || process.env.CLAUDE_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "API key nao configurada. Configure em Configuracoes ou contate o administrador." },
      { status: 400 }
    );
  }

  try {
    const client = new Anthropic({ apiKey });

    const systemPrompt = `Voce e um especialista em editais culturais brasileiros. Ajude a escrever textos para candidaturas a editais.
REGRAS CRITICAS:
- NAO use acentos (a plataforma nao aceita)
- Maximo 8000 caracteres
- Escreva em portugues brasileiro SEM acentos
- Seja objetivo e tecnico
- Use palavras-chave relevantes para o criterio de avaliacao`;

    const userPrompt =
      prompt ||
      `Escreva um texto para o campo "${campo}" do edital "${editalNome}". Criterio de avaliacao: ${criterio}. Maximo 8000 caracteres, SEM acentos.`;

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
