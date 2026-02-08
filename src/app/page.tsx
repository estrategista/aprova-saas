import Link from "next/link";
import {
  Brain,
  FileText,
  Calculator,
  Target,
  Shield,
  Download,
  MessageSquare,
  Radar,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Score Preditivo",
    desc: "Nota em tempo real enquanto voce escreve. Saiba exatamente onde melhorar.",
  },
  {
    icon: MessageSquare,
    title: "Copilot Chat",
    desc: "Consultor IA que conhece cada detalhe do seu edital. Pergunte qualquer coisa.",
  },
  {
    icon: FileText,
    title: "Smart PDF",
    desc: "Upload do PDF, IA extrai tudo em 30s. Campos, criterios, orcamento.",
  },
  {
    icon: Calculator,
    title: "Orcamento",
    desc: "Calculadora com balanco em tempo real e sugestoes de distribuicao.",
  },
  {
    icon: Target,
    title: "Simulador",
    desc: "Simule sua pontuacao e identifique os criterios que precisam de atencao.",
  },
  {
    icon: Shield,
    title: "Quality Gate",
    desc: "7 verificacoes automaticas antes de submeter. Acentos, limites, saldo.",
  },
  {
    icon: Download,
    title: "Export",
    desc: "Proposta formatada com 1 clique. Pronta para colar na plataforma.",
  },
  {
    icon: Radar,
    title: "Discovery",
    desc: "2.600+ editais abertos. Encontre os que combinam com seu perfil.",
  },
];

const stats = [
  { value: "2.600+", label: "Editais mapeados" },
  { value: "12", label: "Camadas de IA" },
  { value: "30s", label: "PDF → Edital" },
  { value: "100%", label: "Gratis" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-base">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-bg-base/80 backdrop-blur-sm border-b border-border-subtle">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-xs">
              A
            </div>
            <span className="text-base font-semibold text-text-primary">
              Aprova.ai
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="btn-primary text-sm px-4 py-2 rounded-lg"
            >
              Comecar Gratis
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="animate-fade-up inline-flex items-center gap-2 border border-border-subtle rounded-full px-3 py-1 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-xs text-text-muted">
              Plataforma de editais culturais com IA
            </span>
          </div>

          <h1 className="animate-fade-up stagger-1 text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary mb-6 leading-[1.1] tracking-tight">
            Aprovacao inteligente
            <br />
            <span className="gradient-text">de editais culturais</span>
          </h1>

          <p className="animate-fade-up stagger-2 text-lg text-text-secondary max-w-xl mx-auto mb-10 leading-relaxed">
            A unica plataforma brasileira com IA que analisa, escreve e
            otimiza suas propostas culturais.
          </p>

          <div className="animate-fade-up stagger-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="btn-primary px-7 py-3 rounded-lg text-base font-semibold inline-flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              Comecar Gratis
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="btn-ghost px-7 py-3 rounded-lg text-base w-full sm:w-auto text-center"
            >
              Ja tenho conta
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-border-subtle">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-bold text-cta mb-1">
                  {s.value}
                </div>
                <div className="text-sm text-text-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text-primary mb-3">
              Tudo para ser aprovado
            </h2>
            <p className="text-text-secondary max-w-md mx-auto">
              8 ferramentas integradas. Do upload do PDF a submissao.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="card-interactive p-5 group"
              >
                <f.icon className="w-5 h-5 text-accent mb-3 group-hover:text-cta transition-colors" />
                <h3 className="text-sm font-semibold text-text-primary mb-1.5">
                  {f.title}
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 border-t border-border-subtle">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-text-primary text-center mb-16">
            3 passos
          </h2>

          <div className="space-y-12">
            {[
              {
                n: "01",
                title: "Upload do PDF",
                desc: "Suba o edital em PDF. A IA extrai campos, criterios, bonus e orcamento automaticamente.",
              },
              {
                n: "02",
                title: "Escreva com IA",
                desc: "Editor com score preditivo em tempo real. Copilot chat tira duvidas sobre o edital.",
              },
              {
                n: "03",
                title: "Exporte e submeta",
                desc: "Proposta formatada com 1 clique. Quality gate verifica tudo antes da submissao.",
              },
            ].map((step) => (
              <div key={step.n} className="flex gap-6 items-start">
                <div className="text-3xl font-bold text-border-strong shrink-0 w-12">
                  {step.n}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-1">
                    {step.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-6 h-6 text-accent" />
          </div>
          <h2 className="text-3xl font-bold text-text-primary mb-4">
            Pronto para ser aprovado?
          </h2>
          <p className="text-text-secondary mb-8 max-w-md mx-auto">
            Crie sua conta gratis e comece a trabalhar no seu proximo edital.
          </p>
          <Link
            href="/register"
            className="btn-primary inline-flex items-center gap-2 px-8 py-3 rounded-lg text-base font-semibold"
          >
            Criar Conta Gratis
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-xs text-text-muted mt-3">
            Sem cartao de credito.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-subtle py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-text-muted">
            Aprova.ai — Editais culturais com IA
          </span>
          <div className="flex items-center gap-4 text-xs text-text-muted">
            <Link href="/login" className="hover:text-text-secondary transition-colors">
              Entrar
            </Link>
            <Link href="/register" className="hover:text-text-secondary transition-colors">
              Criar Conta
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
