import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface ParsedCampo {
  nome: string;
  curto?: string;
  maxChars?: number;
  placeholder?: string;
}

interface ParsedCriterio {
  codigo: string;
  nome: string;
  dica?: string;
  peso?: number;
  escala?: number[];
}

interface ParsedBonus {
  nome: string;
  pontos: number;
  descricao?: string;
}

interface ParsedOrcamento {
  nome: string;
  valor: number;
}

interface ParsedTimeline {
  dia: number;
  titulo: string;
  emoji?: string;
  tasks?: string[];
}

interface ParsedData {
  meta: {
    nome: string;
    orgao?: string;
    tipo?: string;
    valor: number;
    prazo?: string;
    plataforma?: string;
  };
  campos?: ParsedCampo[];
  criterios?: ParsedCriterio[];
  bonus?: ParsedBonus[];
  restricoes?: string[];
  orcamento_sugerido?: ParsedOrcamento[];
  timeline?: ParsedTimeline[];
  candidato?: {
    nome?: string;
    cidade?: string;
    area?: string;
    cotas?: string[];
  };
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
  }

  try {
    const parsed: ParsedData = await req.json();

    if (!parsed.meta?.nome || !parsed.meta?.valor) {
      return NextResponse.json(
        { error: "Nome e valor do edital sao obrigatorios" },
        { status: 400 }
      );
    }

    const edital = await prisma.$transaction(async (tx) => {
      // Create edital
      const ed = await tx.edital.create({
        data: {
          userId: session.user!.id!,
          nome: parsed.meta.nome,
          orgao: parsed.meta.orgao || null,
          tipo: parsed.meta.tipo || "cultural",
          valor: parsed.meta.valor,
          prazo: parsed.meta.prazo ? new Date(parsed.meta.prazo) : null,
          plataforma: parsed.meta.plataforma || null,
          status: "draft",
          restricoes: parsed.restricoes || [],
        },
      });

      // Create candidato if provided
      if (parsed.candidato?.nome) {
        await tx.candidato.create({
          data: {
            editalId: ed.id,
            nome: parsed.candidato.nome,
            cidade: parsed.candidato.cidade || null,
            area: parsed.candidato.area || null,
            cotas: parsed.candidato.cotas || [],
          },
        });
      }

      // Create campos
      const camposData = parsed.campos && parsed.campos.length > 0
        ? parsed.campos
        : [
            { nome: "Objeto da Proposta", curto: "Objeto" },
            { nome: "Oportunidades Geradas", curto: "Oportunidades" },
            { nome: "Trajetoria Cultural", curto: "Trajetoria" },
            { nome: "Resultados e Metas", curto: "Resultados" },
            { nome: "Sustentabilidade", curto: "Sustentabilidade" },
            { nome: "Justificativa", curto: "Justificativa" },
            { nome: "Emprego e Renda", curto: "Emprego" },
            { nome: "Valor Social", curto: "Valor Social" },
          ];

      for (let i = 0; i < camposData.length; i++) {
        const c = camposData[i];
        await tx.campo.create({
          data: {
            editalId: ed.id,
            ordem: i,
            nome: c.nome,
            curto: c.curto || null,
            maxChars: c.maxChars || 8000,
            placeholder: c.placeholder || null,
          },
        });
      }

      // Create criterios
      if (parsed.criterios && parsed.criterios.length > 0) {
        for (const c of parsed.criterios) {
          await tx.criterio.create({
            data: {
              editalId: ed.id,
              codigo: c.codigo,
              nome: c.nome,
              dica: c.dica || null,
              peso: c.peso || 10,
              escala: c.escala || [0, 3, 5, 7, 10],
            },
          });
        }
      }

      // Create bonus
      if (parsed.bonus && parsed.bonus.length > 0) {
        for (const b of parsed.bonus) {
          await tx.bonusItem.create({
            data: {
              editalId: ed.id,
              nome: b.nome,
              pontos: b.pontos,
              descricao: b.descricao || null,
              ativo: true,
              destaque: false,
            },
          });
        }
      }

      // Create orcamento items
      if (parsed.orcamento_sugerido && parsed.orcamento_sugerido.length > 0) {
        for (const o of parsed.orcamento_sugerido) {
          await tx.orcamentoItem.create({
            data: {
              editalId: ed.id,
              nome: o.nome,
              valor: o.valor,
            },
          });
        }
      }

      // Create timeline
      if (parsed.timeline && parsed.timeline.length > 0) {
        for (const t of parsed.timeline) {
          await tx.timelineDay.create({
            data: {
              editalId: ed.id,
              dia: t.dia,
              titulo: t.titulo,
              emoji: t.emoji || null,
              tasks: t.tasks || [],
            },
          });
        }
      }

      return ed;
    });

    return NextResponse.json(edital, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar edital do parse:", error);
    const message =
      error instanceof Error ? error.message : "Erro ao criar edital";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
