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
  const days = await prisma.timelineDay.findMany({
    where: { edital: { id, userId: session.user.id } },
    orderBy: { dia: "asc" },
  });

  return NextResponse.json(days);
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
  const day = await prisma.timelineDay.update({
    where: { id: body.dayId },
    data: { tasks: body.tasks },
  });

  return NextResponse.json(day);
}
