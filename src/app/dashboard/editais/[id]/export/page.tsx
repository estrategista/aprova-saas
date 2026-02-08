import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProposalDocument } from "@/components/export/proposal-document";

export default async function ExportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  const edital = await prisma.edital.findFirst({
    where: { id, userId: session.user.id },
    include: {
      candidato: true,
      campos: { orderBy: { ordem: "asc" } },
      orcamento: true,
    },
  });

  if (!edital) notFound();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="print:hidden mb-6">
        <Link
          href={`/dashboard/editais/${id}`}
          className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-white mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao edital
        </Link>
        <h1 className="text-xl font-bold text-white">Exportar Proposta</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Revise, copie os textos ou imprima a proposta completa.
        </p>
      </div>

      <ProposalDocument
        editalNome={edital.nome}
        orgao={edital.orgao}
        valor={edital.valor}
        prazo={edital.prazo ? edital.prazo.toISOString() : null}
        candidatoNome={edital.candidato?.nome}
        candidatoCidade={edital.candidato?.cidade}
        campos={edital.campos.map((c) => ({
          nome: c.nome,
          curto: c.curto,
          conteudo: c.conteudo,
          maxChars: c.maxChars,
        }))}
        orcamento={edital.orcamento.map((i) => ({
          nome: i.nome,
          valor: i.valor,
          descricao: i.descricao,
        }))}
      />
    </div>
  );
}
