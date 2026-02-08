"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, MapPin, Calendar, DollarSign, Users, ExternalLink, Loader2, Database, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface EditalMatch {
  id: string;
  nome: string;
  orgao: string | null;
  descricao: string | null;
  tipo: string | null;
  valor: number | null;
  vagas: number | null;
  inscricaoAte: string | null;
  url: string | null;
  estado: string | null;
  areas: string[];
  categorias: string[];
  cotasDisponiveis: string[];
  statusEdital: string;
  source: string;
  matchScore: number;
  matchDetails: {
    region: number;
    area: number;
    cotas: number;
    value: number;
    recency: number;
  };
}

interface Stats {
  totalCorpus: number;
  openCount: number;
  returned: number;
  sources: { source: string; count: number }[];
}

const ESTADOS = ["PE", "CE", "SP", "MG", "RS", "BA"];
const TIPOS = ["Edital", "Festival", "Premio", "Oficina"];

function MatchBadge({ score }: { score: number }) {
  const color =
    score >= 75 ? "bg-green-500/20 text-green-400 border-green-500/30" :
    score >= 50 ? "bg-blue-500/20 text-blue-400 border-blue-500/30" :
    score >= 30 ? "bg-amber-500/20 text-amber-400 border-amber-500/30" :
    "bg-slate-500/20 text-slate-400 border-slate-500/30";

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border ${color}`}>
      {score}% match
    </span>
  );
}

function daysLeft(dateStr: string | null): string {
  if (!dateStr) return "";
  const d = Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (d < 0) return "Encerrado";
  if (d === 0) return "Hoje!";
  if (d === 1) return "Amanha";
  return `${d} dias`;
}

export function DiscoveryList() {
  const [editais, setEditais] = useState<EditalMatch[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [estado, setEstado] = useState("");
  const [tipo, setTipo] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const fetchEditais = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("q", search);
      if (estado) params.set("estado", estado);
      if (tipo) params.set("tipo", tipo);
      params.set("status", "aberto");
      params.set("limit", "100");

      const res = await fetch(`/api/discovery?${params}`);
      if (!res.ok) throw new Error("Erro");
      const data = await res.json();
      setEditais(data.editais);
      setStats(data.stats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, estado, tipo]);

  useEffect(() => {
    const timeout = setTimeout(fetchEditais, 300);
    return () => clearTimeout(timeout);
  }, [fetchEditais]);

  return (
    <div>
      {/* Stats bar */}
      {stats && (
        <div className="flex items-center gap-4 text-xs text-slate-400 mb-4 flex-wrap">
          <span className="flex items-center gap-1">
            <Database className="w-3 h-3" />
            {stats.totalCorpus.toLocaleString("pt-BR")} editais no corpus
          </span>
          <span>{stats.openCount} abertos agora</span>
          {stats.sources.map((s) => (
            <span key={s.source} className="text-slate-500">
              {s.source.replace("mapacultural_", "").toUpperCase()}: {s.count}
            </span>
          ))}
        </div>
      )}

      {/* Search + Filters */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Buscar editais por nome, area, palavra-chave..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className={showFilters ? "border-royal" : ""}
        >
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      {showFilters && (
        <div className="flex gap-2 mb-4 flex-wrap">
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="bg-navy-800 border border-navy-600 rounded-lg px-3 py-1.5 text-xs text-white"
          >
            <option value="">Todos estados</option>
            {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="bg-navy-800 border border-navy-600 rounded-lg px-3 py-1.5 text-xs text-white"
          >
            <option value="">Todos tipos</option>
            {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          {(estado || tipo) && (
            <button
              onClick={() => { setEstado(""); setTipo(""); }}
              className="text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              Limpar filtros
            </button>
          )}
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-royal" />
          <span className="ml-2 text-sm text-slate-400">Buscando editais...</span>
        </div>
      ) : editais.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <Database className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Nenhum edital encontrado com esses filtros.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {editais.map((edital) => (
            <div
              key={edital.id}
              className="bg-navy-900 border border-navy-700 rounded-lg p-4 hover:border-navy-600 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-sm font-semibold text-white truncate">{edital.nome}</h3>
                    <MatchBadge score={edital.matchScore} />
                  </div>

                  {edital.descricao && (
                    <p className="text-xs text-slate-400 line-clamp-2 mb-2">{edital.descricao}</p>
                  )}

                  <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                    {edital.estado && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />{edital.estado}
                      </span>
                    )}
                    {edital.valor && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />R$ {edital.valor.toLocaleString("pt-BR")}
                      </span>
                    )}
                    {edital.inscricaoAte && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />{daysLeft(edital.inscricaoAte)}
                      </span>
                    )}
                    {edital.vagas && (
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />{edital.vagas} vagas
                      </span>
                    )}
                    {edital.tipo && (
                      <Badge variant="secondary" className="text-[10px]">{edital.tipo}</Badge>
                    )}
                  </div>

                  {edital.cotasDisponiveis.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {edital.cotasDisponiveis.map((c) => (
                        <span key={c} className="text-[10px] bg-royal/10 text-royal-light border border-royal/20 rounded px-1.5 py-0.5">
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {edital.url && (
                  <a
                    href={edital.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 flex items-center gap-1 text-xs text-royal-light hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
