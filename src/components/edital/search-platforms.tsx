"use client";

import { ExternalLink } from "lucide-react";

const PLATFORMS = [
  {
    nome: "Mapa Cultural PE",
    url: "https://www.mapacultural.pe.gov.br",
    desc: "Plataforma oficial de editais culturais de Pernambuco",
    cor: "bg-orange-600/20 border-orange-600/30",
  },
  {
    nome: "Prosas",
    url: "https://prosas.com.br",
    desc: "Maior plataforma de editais e chamadas publicas do Brasil",
    cor: "bg-orange-500/20 border-orange-500/30",
  },
  {
    nome: "Gov.br Cultura",
    url: "https://www.gov.br/cultura",
    desc: "Ministerio da Cultura - editais federais",
    cor: "bg-green-600/20 border-green-600/30",
  },
  {
    nome: "FUNARTE",
    url: "https://www.gov.br/funarte",
    desc: "Fundacao Nacional de Artes - editais de fomento",
    cor: "bg-amber-600/20 border-amber-600/30",
  },
  {
    nome: "SESC",
    url: "https://www.sesc.com.br",
    desc: "Editais culturais do SESC em todo o Brasil",
    cor: "bg-red-600/20 border-red-600/30",
  },
  {
    nome: "Itau Cultural",
    url: "https://www.itaucultural.org.br",
    desc: "Programas e bolsas de fomento a cultura",
    cor: "bg-orange-600/20 border-orange-600/30",
  },
  {
    nome: "Mapa Cultural Brasil",
    url: "https://mapas.cultura.gov.br",
    desc: "Sistema Nacional de Informacoes e Indicadores Culturais",
    cor: "bg-amber-600/20 border-amber-600/30",
  },
  {
    nome: "BNB/BNDES",
    url: "https://www.bnb.gov.br",
    desc: "Linhas de credito para economia criativa no Nordeste",
    cor: "bg-orange-700/20 border-orange-700/30",
  },
];

export function SearchPlatforms() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-white mb-1">Plataformas de Editais</h3>
        <p className="text-xs text-neutral-400">Busque novos editais e oportunidades culturais</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PLATFORMS.map((p) => (
          <a
            key={p.nome}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`rounded-xl border p-4 ${p.cor} hover:opacity-80 transition-opacity block`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white">{p.nome}</h4>
                <p className="text-xs text-neutral-400 mt-1">{p.desc}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-neutral-500 shrink-0 ml-2" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
