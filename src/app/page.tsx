import Link from "next/link";
import {
  Brain,
  FileText,
  Calculator,
  Target,
  Shield,
  Download,
  Zap,
  BarChart3,
  MessageSquare,
  Radar,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "IA Integrada",
    desc: "Analise e geracao de textos com Claude AI. Score preditivo em tempo real enquanto voce escreve.",
    span: "md:col-span-2 md:row-span-2",
    gradient: "from-blue-500/20 to-indigo-500/20",
    iconColor: "text-blue-400",
  },
  {
    icon: MessageSquare,
    title: "Copilot Chat",
    desc: "Consultor IA 24/7 que conhece cada detalhe do seu edital.",
    span: "md:col-span-1",
    gradient: "from-purple-500/20 to-fuchsia-500/20",
    iconColor: "text-purple-400",
  },
  {
    icon: Calculator,
    title: "Orcamento Smart",
    desc: "Calculadora orcamentaria com balanco em tempo real.",
    span: "md:col-span-1",
    gradient: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-400",
  },
  {
    icon: Target,
    title: "Simulador de Nota",
    desc: "Simule sua pontuacao antes de submeter. Identifique pontos fracos e otimize.",
    span: "md:col-span-1",
    gradient: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-400",
  },
  {
    icon: Shield,
    title: "Quality Gate",
    desc: "7 verificacoes automaticas pre-submissao.",
    span: "md:col-span-1",
    gradient: "from-cyan-500/20 to-sky-500/20",
    iconColor: "text-cyan-400",
  },
  {
    icon: Radar,
    title: "Discovery Engine",
    desc: "2.600+ editais. Encontre oportunidades que combinam com seu perfil.",
    span: "md:col-span-2",
    gradient: "from-rose-500/20 to-pink-500/20",
    iconColor: "text-rose-400",
  },
];

const stats = [
  { value: "2.600+", label: "Editais no Corpus" },
  { value: "12", label: "Camadas de IA" },
  { value: "100%", label: "Gratuito para Comecar" },
  { value: "30s", label: "PDF para Edital Completo" },
];

const steps = [
  {
    num: "01",
    title: "Upload do PDF",
    desc: "Suba o PDF do edital e nossa IA extrai campos, criterios, bonus e orcamento em 30 segundos.",
    icon: FileText,
  },
  {
    num: "02",
    title: "Escreva com IA",
    desc: "Editor inteligente com score em tempo real, sugestoes contextuais e copilot chat.",
    icon: Sparkles,
  },
  {
    num: "03",
    title: "Exporte e Submeta",
    desc: "Proposta formatada com 1 clique. Quality gate verifica tudo antes da submissao.",
    icon: Download,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* ===== HEADER ===== */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
              A
            </div>
            <span className="text-xl font-bold text-white">
              Aprova<span className="text-blue-400">.ai</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-slate-300 hover:text-white transition-colors hidden sm:block"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="btn-premium text-sm text-white px-5 py-2 rounded-xl font-medium"
            >
              Comecar Gratis
            </Link>
          </div>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Animated blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-[100px] animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-cyan-500/15 rounded-full blur-[100px] animate-blob animation-delay-4000" />
        </div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="animate-fade-up inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-8">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-slate-300 font-medium">
              Plataforma #1 de Editais Culturais com IA
            </span>
          </div>

          {/* Title */}
          <h1 className="animate-fade-up stagger-1 text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
            Aprovacao Inteligente
            <br />
            <span className="gradient-text">de Editais Culturais</span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-up stagger-2 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            A unica plataforma brasileira com IA que analisa, escreve e
            otimiza suas propostas culturais.{" "}
            <span className="text-slate-300">
              Score preditivo em tempo real.
            </span>
          </p>

          {/* CTAs */}
          <div className="animate-fade-up stagger-3 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="btn-premium text-white px-8 py-3.5 rounded-xl text-lg font-semibold inline-flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              Comecar Gratis
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="glass text-slate-300 px-8 py-3.5 rounded-xl text-lg font-medium hover:bg-white/10 transition-all w-full sm:w-auto text-center"
            >
              Ja tenho conta
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="animate-fade-up stagger-4 mt-16 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Sem cartao de credito</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Setup em 30 segundos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>2.600+ editais mapeados</span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-3 rounded-full bg-white/40 animate-pulse" />
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="relative py-20 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES BENTO GRID ===== */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 mesh-bg" />
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs text-slate-300 font-medium">
                Recursos Poderosos
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Tudo que voce precisa para{" "}
              <span className="gradient-text">ser aprovado</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              6 ferramentas integradas com inteligencia artificial. Do
              upload do PDF a submissao da proposta.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[180px]">
            {features.map((f) => (
              <div
                key={f.title}
                className={`${f.span} group relative rounded-2xl glass-card overflow-hidden hover-glow cursor-default`}
              >
                {/* Gradient background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Content */}
                <div className="relative z-10 p-6 h-full flex flex-col">
                  <div
                    className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors`}
                  >
                    <f.icon className={`w-5 h-5 ${f.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {f.title}
                  </h3>
                  <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors leading-relaxed">
                    {f.desc}
                  </p>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-blue-500 to-cyan-400 w-0 group-hover:w-full transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="relative py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
              <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs text-slate-300 font-medium">
                Simples e Rapido
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              3 passos para a{" "}
              <span className="gradient-text-purple">aprovacao</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <div
                key={step.num}
                className="group relative rounded-2xl glass-card p-8 hover-glow"
              >
                {/* Step number */}
                <div className="text-5xl font-bold text-white/5 absolute top-4 right-6 group-hover:text-white/10 transition-colors">
                  {step.num}
                </div>

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-5">
                  <step.icon className="w-6 h-6 text-blue-400" />
                </div>

                <h3 className="text-xl font-semibold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {step.desc}
                </p>

                {/* Connector arrow (not last) */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 z-20">
                    <ArrowRight className="w-6 h-6 text-white/10" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SOCIAL PROOF ===== */}
      <section className="relative py-24 border-t border-white/5">
        <div className="absolute inset-0 mesh-bg-hero" />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <div className="aurora-border">
            <div className="bg-navy-950 p-10 md:p-16 text-center">
              {/* Glow orb */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mx-auto mb-8 flex items-center justify-center animate-glow">
                <Sparkles className="w-8 h-8 text-white" />
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Pronto para{" "}
                <span className="gradient-text">ser aprovado</span>?
              </h2>
              <p className="text-slate-400 mb-10 max-w-lg mx-auto text-lg">
                Junte-se a produtores culturais que ja estao usando IA para
                escrever propostas melhores e mais rapido.
              </p>
              <Link
                href="/register"
                className="btn-premium inline-flex items-center gap-2 text-white px-10 py-4 rounded-xl text-lg font-semibold"
              >
                Criar Conta Gratis
                <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-xs text-slate-500 mt-4">
                Sem cartao de credito. Setup em 30 segundos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-white/5 py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                A
              </div>
              <span className="text-sm font-semibold text-white">
                Aprova<span className="text-blue-400">.ai</span>
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Aprovacao Inteligente de Editais Culturais. Feito com IA no
              Brasil.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <Link
                href="/login"
                className="hover:text-slate-300 transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/register"
                className="hover:text-slate-300 transition-colors"
              >
                Criar Conta
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
