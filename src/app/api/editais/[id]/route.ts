import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const edital = await prisma.edital.findFirst({
    where: { id, userId: session.user.id },
    include: {
      candidato: true,
      campos: { orderBy: { ordem: "asc" } },
      criterios: true,
      orcamento: true,
      timeline: { orderBy: { dia: "asc" } },
      bonus: true,
    },
  });

  if (!edital) {
    return NextResponse.json({ error: "Edital nao encontrado" }, { status: 404 });
  }

  return NextResponse.json(edital);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.edital.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Edital nao encontrado" }, { status: 404 });
  }

  const body = await req.json();
  const edital = await prisma.edital.update({
    where: { id },
    data: {
      nome: body.nome,
      orgao: body.orgao,
      tipo: body.tipo,
      valor: body.valor,
      valorExato: body.valorExato,
      prazo: body.prazo ? new Date(body.prazo) : null,
      plataforma: body.plataforma,
      status: body.status,
      restricoes: body.restricoes,
    },
  });

  return NextResponse.json(edital);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.edital.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Edital nao encontrado" }, { status: 404 });
  }

  await prisma.edital.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
