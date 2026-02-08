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
      max_tokens: 4096,
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
              text: `Analise este edital e extraia as informacoes em formato JSON com a seguinte estrutura:
{
  "meta": { "nome": "", "orgao": "", "tipo": "cultural", "valor": 0, "prazo": "YYYY-MM-DD", "plataforma": "" },
  "campos": [{ "nome": "", "curto": "", "maxChars": 8000, "placeholder": "" }],
  "criterios": [{ "codigo": "a", "nome": "", "dica": "", "peso": 10, "escala": [0,3,5,7,10] }],
  "bonus": [{ "nome": "", "pontos": 0, "descricao": "" }],
  "restricoes": [],
  "orcamento_sugerido": [{ "nome": "", "valor": 0 }]
}
Retorne APENAS o JSON valido, sem markdown ou explicacoes.`,
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
