import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createEditalSchema = z.object({
  nome: z.string().min(1),
  orgao: z.string().optional(),
  tipo: z.string().default("cultural"),
  valor: z.number().positive(),
  valorExato: z.boolean().default(true),
  prazo: z.string().optional(),
  plataforma: z.string().optional(),
  configJson: z.any().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
  }

  const editais = await prisma.edital.findMany({
    where: { userId: session.user.id },
    include: {
      campos: { select: { id: true, nome: true, conteudo: true } },
      _count: { select: { campos: true, orcamento: true, timeline: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(editais);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = createEditalSchema.parse(body);

    const edital = await prisma.edital.create({
      data: {
        ...data,
        prazo: data.prazo ? new Date(data.prazo) : null,
        userId: session.user.id,
      },
    });

    return NextResponse.json(edital, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
