import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      cidade: true,
      area: true,
      plan: true,
      claudeApiKey: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Usuario nao encontrado" }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      ...user,
      claudeApiKey: user.claudeApiKey ? "configured" : null,
    },
  });
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const { name, cidade, area, claudeApiKey } = body;

  const data: Record<string, string> = {};
  if (name !== undefined) data.name = name;
  if (cidade !== undefined) data.cidade = cidade;
  if (area !== undefined) data.area = area;
  if (claudeApiKey !== undefined) data.claudeApiKey = claudeApiKey;

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data,
    select: { id: true, name: true, email: true, cidade: true, area: true, plan: true },
  });

  return NextResponse.json({ user });
}
