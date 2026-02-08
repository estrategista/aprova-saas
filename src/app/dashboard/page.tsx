import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  FileText,
  Clock,
  CheckCircle2,
  Archive,
  ArrowRight,
  Sparkles,
  BarChart3,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

const statusConfig: Record<
  string,
  { label: string; color: string; bg: string; icon: typeof Clock }
> = {
  draft: {
    label: "Rascunho",
    color: "text-slate-400",
    bg: "bg-slate-400/10 border-slate-400/20",
    icon: Clock,
  },
  active: {
    label: "Em andamento",
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/20",
    icon: FileText,
  },
  submitted: {
    label: "Submetido",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/20",
    icon: CheckCircle2,
  },
  archived: {
    label: "Arquivado",
    color: "text-slate-500",
    bg: "bg-slate-500/10 border-slate-500/20",
    icon: Archive,
  },
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
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Meus Editais</h1>
          <p className="text-sm text-slate-400 mt-1">
            {editais.length === 0
              ? "Nenhum edital ainda. Crie seu primeiro!"
              : `${editais.length} edital(is)`}
          </p>
        </div>
        <Link
          href="/dashboard/editais/novo"
          className="btn-premium inline-flex items-center gap-2 text-white px-5 py-2.5 rounded-xl text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Novo Edital
        </Link>
      </div>

      {editais.length === 0 ? (
        /* Empty state */
        <div className="glass-card rounded-2xl p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Nenhum edital cadastrado
          </h3>
          <p className="text-sm text-slate-400 mb-8 max-w-md mx-auto">
            Comece criando seu primeiro edital. Voce pode subir um PDF e nossa
            IA extrai tudo automaticamente.
          </p>
          <Link
            href="/dashboard/editais/novo"
            className="btn-premium inline-flex items-center gap-2 text-white px-8 py-3 rounded-xl text-sm font-semibold"
          >
            <Plus className="w-4 h-4" />
            Criar Primeiro Edital
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        /* Edital cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {editais.map((edital) => {
            const status = statusConfig[edital.status] || statusConfig.draft;
            const StatusIcon = status.icon;
            const preenchidos = camposPreenchidos(edital.campos);
            const totalCampos = edital._count.campos;
            const progress =
              totalCampos > 0 ? (preenchidos / totalCampos) * 100 : 0;

            return (
              <Link
                key={edital.id}
                href={`/dashboard/editais/${edital.id}`}
                className="group relative rounded-2xl glass-card overflow-hidden hover-glow"
              >
                {/* Top gradient accent */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-base font-semibold text-white group-hover:text-blue-300 transition-colors line-clamp-2 pr-2">
                      {edital.nome}
                    </h3>
                    <div
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium shrink-0 border ${status.bg} ${status.color}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </div>
                  </div>

                  {edital.orgao && (
                    <p className="text-xs text-slate-500 mb-4">{edital.orgao}</p>
                  )}

                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between text-slate-400">
                      <span>Valor</span>
                      <span className="text-white font-medium">
                        {formatCurrency(edital.valor)}
                      </span>
                    </div>
                    {edital.prazo && (
                      <div className="flex justify-between text-slate-400">
                        <span>Prazo</span>
                        <span>{formatDate(edital.prazo)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <BarChart3 className="w-3.5 h-3.5" />
                        <span>Textos</span>
                      </div>
                      <span>
                        {preenchidos}/{totalCampos}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  {totalCampos > 0 && (
                    <div className="mt-5">
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-blue-500 to-cyan-400"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1.5 text-right">
                        {Math.round(progress)}% completo
                      </p>
                    </div>
                  )}
                </div>

                <div className="px-6 py-3 border-t border-white/5">
                  <p className="text-[11px] text-slate-500">
                    Atualizado em {formatDate(edital.updatedAt)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
