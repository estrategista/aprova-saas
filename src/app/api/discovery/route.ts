import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateMatchScore, type UserProfile } from "@/lib/discovery-engine";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const estado = searchParams.get("estado");
  const tipo = searchParams.get("tipo");
  const area = searchParams.get("area");
  const status = searchParams.get("status") || "aberto";
  const limit = parseInt(searchParams.get("limit") || "50");
  const search = searchParams.get("q");

  // Build user profile from DB
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { cidade: true, area: true },
  });

  // Get user's candidato data from most recent edital for cotas
  const recentEdital = await prisma.edital.findFirst({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: { candidato: true },
  });

  const profile: UserProfile = {
    cidade: user?.cidade || recentEdital?.candidato?.cidade,
    area: user?.area || recentEdital?.candidato?.area,
    cotas: recentEdital?.candidato?.cotas || [],
    valorPreferido: recentEdital?.valor,
  };

  // Query editais
  const where: Record<string, unknown> = {};
  if (status) where.statusEdital = status;
  if (estado) where.estado = estado;
  if (tipo) where.tipo = tipo;
  if (search) {
    where.OR = [
      { nome: { contains: search, mode: "insensitive" } },
      { descricao: { contains: search, mode: "insensitive" } },
      { keywords: { has: search.toLowerCase() } },
    ];
  }
  if (area) {
    where.OR = [
      ...(Array.isArray(where.OR) ? where.OR as Record<string, unknown>[] : []),
      { categorias: { has: area.toLowerCase() } },
      { areas: { has: area } },
    ];
  }

  const editais = await prisma.editalPublico.findMany({
    where,
    take: Math.min(limit, 200),
    orderBy: { inscricaoAte: "asc" },
  });

  // Calculate match scores
  const scored = editais.map((e) => {
    const { score, details } = calculateMatchScore(profile, {
      estado: e.estado,
      categorias: e.categorias,
      areas: e.areas,
      keywords: e.keywords,
      cotasDisponiveis: e.cotasDisponiveis,
      valor: e.valor,
      inscricaoAte: e.inscricaoAte,
    });

    return {
      id: e.id,
      nome: e.nome,
      orgao: e.orgao,
      descricao: e.descricao,
      tipo: e.tipo,
      valor: e.valor,
      vagas: e.vagas,
      inscricaoDe: e.inscricaoDe,
      inscricaoAte: e.inscricaoAte,
      url: e.url,
      estado: e.estado,
      areas: e.areas,
      categorias: e.categorias,
      cotasDisponiveis: e.cotasDisponiveis,
      statusEdital: e.statusEdital,
      source: e.source,
      matchScore: score,
      matchDetails: details,
    };
  });

  // Sort by match score (best first)
  scored.sort((a, b) => b.matchScore - a.matchScore);

  // Stats
  const totalCorpus = await prisma.editalPublico.count();
  const openCount = await prisma.editalPublico.count({ where: { statusEdital: "aberto" } });
  const sources = await prisma.editalPublico.groupBy({ by: ["source"], _count: true });

  return NextResponse.json({
    editais: scored,
    profile,
    stats: {
      totalCorpus,
      openCount,
      returned: scored.length,
      sources: sources.map((s) => ({ source: s.source, count: s._count })),
    },
  });
}
