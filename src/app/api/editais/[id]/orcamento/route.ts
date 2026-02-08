import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const orcamentoSchema = z.object({
  nome: z.string().min(1),
  valor: z.number().min(0),
  descricao: z.string().optional(),
  cotacoes: z.any().optional(),
});

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const items = await prisma.orcamentoItem.findMany({
    where: { edital: { id, userId: session.user.id } },
  });

  return NextResponse.json(items);
}

export async function POST(
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
  const data = orcamentoSchema.parse(body);

  const item = await prisma.orcamentoItem.create({
    data: { ...data, editalId: id },
  });

  return NextResponse.json(item, { status: 201 });
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const item = await prisma.orcamentoItem.update({
    where: { id: body.itemId },
    data: {
      nome: body.nome,
      valor: body.valor,
      descricao: body.descricao,
      cotacoes: body.cotacoes,
    },
  });

  return NextResponse.json(item);
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const itemId = searchParams.get("itemId");

  if (!itemId) {
    return NextResponse.json({ error: "itemId obrigatorio" }, { status: 400 });
  }

  await prisma.orcamentoItem.delete({ where: { id: itemId } });
  return NextResponse.json({ success: true });
}
