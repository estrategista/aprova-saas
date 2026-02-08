import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildChatContext } from "@/lib/chat-utils";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Nao autorizado" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { editalId, messages } = await req.json();

  if (!editalId || !messages?.length) {
    return new Response(JSON.stringify({ error: "editalId e messages obrigatorios" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "API key nao configurada" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const edital = await prisma.edital.findFirst({
    where: { id: editalId, userId: session.user.id },
    include: {
      candidato: true,
      campos: { orderBy: { ordem: "asc" } },
      criterios: true,
      orcamento: true,
      bonus: true,
    },
  });

  if (!edital) {
    return new Response(JSON.stringify({ error: "Edital nao encontrado" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const systemPrompt = buildChatContext({
    nome: edital.nome,
    orgao: edital.orgao,
    valor: edital.valor,
    prazo: edital.prazo,
    plataforma: edital.plataforma,
    candidato: edital.candidato
      ? {
          nome: edital.candidato.nome,
          cidade: edital.candidato.cidade,
          area: edital.candidato.area,
          cotas: edital.candidato.cotas,
        }
      : null,
    campos: edital.campos.map((c) => ({
      nome: c.nome,
      curto: c.curto,
      conteudo: c.conteudo,
      maxChars: c.maxChars,
    })),
    criterios: edital.criterios.map((c) => ({
      codigo: c.codigo,
      nome: c.nome,
      dica: c.dica,
      peso: c.peso,
    })),
    orcamento: edital.orcamento.map((i) => ({
      nome: i.nome,
      valor: i.valor,
    })),
    bonus: edital.bonus.map((b) => ({
      nome: b.nome,
      pontos: b.pontos,
      ativo: b.ativo,
    })),
  });

  try {
    const client = new Anthropic({ apiKey });

    const stream = await client.messages.stream({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 2048,
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
              );
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: err instanceof Error ? err.message : "Erro no stream" })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Erro ao processar chat";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
