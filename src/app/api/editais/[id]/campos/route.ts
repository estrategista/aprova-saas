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
  });

  if (!edital) {
    return NextResponse.json({ error: "Nao encontrado" }, { status: 404 });
  }

  const campos = await prisma.campo.findMany({
    where: { editalId: id },
    orderBy: { ordem: "asc" },
  });

  return NextResponse.json(campos);
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
  const edital = await prisma.edital.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!edital) {
    return NextResponse.json({ error: "Nao encontrado" }, { status: 404 });
  }

  const body = await req.json();
  const campo = await prisma.campo.update({
    where: { id: body.campoId },
    data: { conteudo: body.conteudo },
  });

  return NextResponse.json(campo);
}
