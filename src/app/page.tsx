import Link from "next/link";
import { FileText, Brain, Calculator, Target, Shield, Download } from "lucide-react";

const features = [
  { icon: Brain, title: "IA Integrada", desc: "Analise e geracao de textos com Claude AI para maximizar sua pontuacao" },
  { icon: FileText, title: "Editor Inteligente", desc: "8 campos com auto-save, detector de acentos e contador de caracteres" },
  { icon: Calculator, title: "Orcamento Automatico", desc: "Calculadora orcamentaria com balanco em tempo real e cotacoes" },
  { icon: Target, title: "Simulador de Nota", desc: "Simule sua pontuacao antes de submeter e identifique pontos fracos" },
  { icon: Shield, title: "Quality Gate", desc: "7 verificacoes automaticas pre-submissao para garantir conformidade" },
  { icon: Download, title: "Export PDF", desc: "Exporte sua proposta completa em PDF profissional para impressao" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-navy-950">
      <header className="border-b border-navy-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-royal flex items-center justify-center text-white font-bold text-sm">A</div>
            <span className="text-xl font-bold text-white">Aprova.ai</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-slate-300 hover:text-white transition-colors">
              Entrar
            </Link>
            <Link href="/register" className="text-sm bg-royal text-white px-4 py-2 rounded-lg hover:bg-royal-dark transition-colors">
              Criar Conta
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-royal/10 border border-royal/30 rounded-full px-4 py-1.5 mb-6">
          <span className="text-xs text-royal-light font-medium">Beta - Editais Culturais BR</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Aprovacao Inteligente<br />
          <span className="text-royal-light">de Editais Culturais</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
          Plataforma com IA para produtores culturais brasileiros. Escreva propostas melhores,
          simule pontuacoes e aumente suas chances de aprovacao.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/register" className="bg-royal text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-royal-dark transition-colors">
            Comecar Gratis
          </Link>
          <Link href="/login" className="border border-navy-600 text-slate-300 px-8 py-3 rounded-lg text-lg font-medium hover:bg-navy-800 transition-colors">
            Ja tenho conta
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-white text-center mb-12">Tudo que voce precisa para ser aprovado</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-navy-700 bg-navy-900 p-6 hover:border-royal/50 transition-colors">
              <f.icon className="w-10 h-10 text-royal-light mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="rounded-2xl bg-gradient-to-r from-royal/20 to-royal-dark/20 border border-royal/30 p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Pronto para aumentar suas chances?</h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">
            Crie sua conta gratis e comece a trabalhar no seu proximo edital agora mesmo.
          </p>
          <Link href="/register" className="inline-block bg-royal text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-royal-dark transition-colors">
            Criar Conta Gratis
          </Link>
        </div>
      </section>

      <footer className="border-t border-navy-800 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-slate-500">
          Aprova.ai - Aprovacao Inteligente de Editais Culturais
        </div>
      </footer>
    </div>
  );
}
