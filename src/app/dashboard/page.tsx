import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, FileText, Clock, CheckCircle2, Archive } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  draft: { label: "Rascunho", color: "text-slate-400 bg-slate-400/10", icon: Clock },
  active: { label: "Em andamento", color: "text-royal-light bg-royal/10", icon: FileText },
  submitted: { label: "Submetido", color: "text-green-400 bg-green-400/10", icon: CheckCircle2 },
  archived: { label: "Arquivado", color: "text-slate-500 bg-slate-500/10", icon: Archive },
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const editais = await prisma.edital.findMany({
    where: { userId: session.user.id },
    include: {
      campos: { select: { conteudo: true } },
      _count: { select: { campos: true, orcamento: true, timeline: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  const camposPreenchidos = (campos: { conteudo: string | null }[]) =>
    campos.filter((c) => c.conteudo && c.conteudo.length > 0).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Meus Editais</h1>
          <p className="text-sm text-slate-400 mt-1">
            {editais.length === 0 ? "Nenhum edital ainda. Crie seu primeiro!" : `${editais.length} edital(is)`}
          </p>
        </div>
        <Link href="/dashboard/editais/novo" className="inline-flex items-center gap-2 bg-royal text-white px-4 py-2 rounded-lg hover:bg-royal-dark transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" />
          Novo Edital
        </Link>
      </div>

      {editais.length === 0 ? (
        <div className="rounded-xl border border-dashed border-navy-600 bg-navy-900/50 p-12 text-center">
          <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-300 mb-2">Nenhum edital cadastrado</h3>
          <p className="text-sm text-slate-500 mb-6">Comece criando seu primeiro edital para usar todas as ferramentas.</p>
          <Link href="/dashboard/editais/novo" className="inline-flex items-center gap-2 bg-royal text-white px-6 py-2.5 rounded-lg hover:bg-royal-dark transition-colors text-sm font-medium">
            <Plus className="w-4 h-4" />
            Criar Primeiro Edital
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {editais.map((edital) => {
            const status = statusConfig[edital.status] || statusConfig.draft;
            const StatusIcon = status.icon;
            const preenchidos = camposPreenchidos(edital.campos);
            const totalCampos = edital._count.campos;

            return (
              <Link key={edital.id} href={`/dashboard/editais/${edital.id}`} className="rounded-xl border border-navy-700 bg-navy-900 p-5 hover:border-royal/50 transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-base font-semibold text-white group-hover:text-royal-light transition-colors line-clamp-2">{edital.nome}</h3>
                  <div className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium shrink-0 ${status.color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {status.label}
                  </div>
                </div>
                {edital.orgao && <p className="text-xs text-slate-500 mb-3">{edital.orgao}</p>}
                <div className="space-y-2 text-sm text-slate-400">
                  <div className="flex justify-between">
                    <span>Valor</span>
                    <span className="text-white font-medium">{formatCurrency(edital.valor)}</span>
                  </div>
                  {edital.prazo && (
                    <div className="flex justify-between">
                      <span>Prazo</span>
                      <span>{formatDate(edital.prazo)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Textos</span>
                    <span>{preenchidos}/{totalCampos} preenchidos</span>
                  </div>
                </div>
                {totalCampos > 0 && (
                  <div className="mt-4">
                    <div className="h-1.5 bg-navy-800 rounded-full overflow-hidden">
                      <div className="h-full bg-royal rounded-full transition-all" style={{ width: `${(preenchidos / totalCampos) * 100}%` }} />
                    </div>
                  </div>
                )}
                <p className="text-xs text-slate-600 mt-3">Atualizado em {formatDate(edital.updatedAt)}</p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
