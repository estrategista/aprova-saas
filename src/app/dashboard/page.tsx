import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, FileText, Clock, CheckCircle2, Archive, ArrowRight, Sparkles } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  draft: { label: "Rascunho", color: "text-text-muted bg-bg-surface border border-border-default", icon: Clock },
  active: { label: "Em andamento", color: "text-accent bg-accent/10 border border-accent/20", icon: FileText },
  submitted: { label: "Submetido", color: "text-emerald-400 bg-emerald-400/10 border border-emerald-400/20", icon: CheckCircle2 },
  archived: { label: "Arquivado", color: "text-text-muted bg-bg-surface border border-border-default", icon: Archive },
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
          <h1 className="text-2xl font-bold text-text-primary">Meus Editais</h1>
          <p className="text-sm text-text-muted mt-1">
            {editais.length === 0 ? "Nenhum edital ainda." : `${editais.length} edital(is)`}
          </p>
        </div>
        <Link href="/dashboard/editais/novo"
          className="btn-primary inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm">
          <Plus className="w-4 h-4" /> Novo Edital
        </Link>
      </div>

      {editais.length === 0 ? (
        <div className="border border-border-subtle bg-bg-elevated rounded-xl p-14 text-center">
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-5">
            <Sparkles className="w-6 h-6 text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">Nenhum edital cadastrado</h3>
          <p className="text-sm text-text-muted mb-6 max-w-sm mx-auto">
            Suba um PDF ou crie manualmente.
          </p>
          <Link href="/dashboard/editais/novo"
            className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold">
            <Plus className="w-4 h-4" /> Criar Edital <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {editais.map((edital) => {
            const status = statusConfig[edital.status] || statusConfig.draft;
            const StatusIcon = status.icon;
            const preenchidos = camposPreenchidos(edital.campos);
            const totalCampos = edital._count.campos;
            const progress = totalCampos > 0 ? (preenchidos / totalCampos) * 100 : 0;

            return (
              <Link key={edital.id} href={`/dashboard/editais/${edital.id}`}
                className="card-interactive group p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors line-clamp-2 pr-2">
                    {edital.nome}
                  </h3>
                  <div className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium shrink-0 ${status.color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {status.label}
                  </div>
                </div>

                {edital.orgao && <p className="text-xs text-text-muted mb-3">{edital.orgao}</p>}

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-text-muted">
                    <span>Valor</span>
                    <span className="text-text-primary font-medium">{formatCurrency(edital.valor)}</span>
                  </div>
                  {edital.prazo && (
                    <div className="flex justify-between text-text-muted">
                      <span>Prazo</span>
                      <span>{formatDate(edital.prazo)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-text-muted">
                    <span>Textos</span>
                    <span>{preenchidos}/{totalCampos}</span>
                  </div>
                </div>

                {totalCampos > 0 && (
                  <div className="mt-4">
                    <div className="h-1 bg-bg-surface rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                )}

                <p className="text-[11px] text-text-muted mt-3">
                  Atualizado {formatDate(edital.updatedAt)}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
