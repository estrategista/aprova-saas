import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header - quase invisivel */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-base font-semibold text-white tracking-tight">
            Aprova.ai
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray hover:text-gray-light transition-colors">
              Entrar
            </Link>
            <Link href="/register" className="btn-primary text-sm px-4 py-2 rounded-lg">
              Comecar
            </Link>
          </div>
        </div>
      </header>

      {/* ===== HERO - Manifesto ===== */}
      <section className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="animate-fade-up text-sm text-orange uppercase tracking-[0.2em] mb-8">
            Para quem faz cultura acontecer
          </p>

          <h1 className="animate-fade-up stagger-1 text-5xl sm:text-7xl md:text-8xl font-bold text-white leading-[0.95] tracking-tight mb-8">
            Seu projeto
            <br />
            <span className="text-orange">merece ser visto.</span>
          </h1>

          <p className="animate-fade-up stagger-2 text-xl sm:text-2xl text-gray-light max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            A diferenca entre ser aprovado e ser ignorado
            nao e talento. E como voce apresenta.
          </p>

          <div className="animate-fade-up stagger-3">
            <Link href="/register"
              className="btn-primary inline-flex items-center gap-3 px-8 py-4 rounded-lg text-lg font-bold">
              Comecar agora
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== BELIEF SECTION ===== */}
      <section className="py-32 px-6 border-t border-surface-light">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.05] tracking-tight mb-8">
            O problema nao e
            <br />
            <span className="text-gray">o seu projeto.</span>
          </h2>
          <p className="text-xl text-gray-light leading-relaxed max-w-xl">
            E a proposta. 90% dos projetos culturais sao rejeitados
            nao por falta de qualidade, mas por como sao escritos.
            Nos mudamos isso.
          </p>
        </div>
      </section>

      {/* ===== O QUE FAZ ===== */}
      <section className="py-32 px-6 border-t border-surface-light">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
            <div>
              <h3 className="text-3xl sm:text-4xl font-bold text-white leading-tight tracking-tight mb-6">
                IA que entende
                <br />
                <span className="text-orange">editais culturais.</span>
              </h3>
              <p className="text-lg text-gray-light leading-relaxed">
                Nao e um ChatGPT generico. E uma inteligencia
                treinada em milhares de editais brasileiros que
                sabe exatamente o que cada avaliador procura.
              </p>
            </div>
            <div className="space-y-10">
              {[
                { n: "01", text: "Suba o PDF do edital. 30 segundos. Tudo extraido." },
                { n: "02", text: "Escreva com score em tempo real. Saiba sua nota antes de enviar." },
                { n: "03", text: "Exporte. Submeta. Seja aprovado." },
              ].map((step) => (
                <div key={step.n} className="flex gap-5">
                  <span className="text-sm font-bold text-orange shrink-0 pt-1">{step.n}</span>
                  <p className="text-lg text-gray-light leading-relaxed">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== NUMBERS - Prova ===== */}
      <section className="py-32 px-6 border-t border-surface-light">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8">
            {[
              { value: "2.614", desc: "editais mapeados no Brasil" },
              { value: "30s", desc: "para transformar PDF em projeto" },
              { value: "12", desc: "camadas de inteligencia artificial" },
            ].map((stat) => (
              <div key={stat.value}>
                <div className="text-5xl sm:text-6xl font-bold text-orange tracking-tight mb-3">
                  {stat.value}
                </div>
                <p className="text-base text-gray">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CLOSING - Crenca ===== */}
      <section className="py-40 px-6 border-t border-surface-light">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.05] tracking-tight mb-8">
            Cultura nao pode depender
            <br />
            <span className="text-orange">de sorte.</span>
          </h2>
          <p className="text-xl text-gray-light mb-12 max-w-lg mx-auto leading-relaxed font-light">
            Cada projeto rejeitado e uma historia que nao foi contada.
            Uma comunidade que nao foi transformada.
            Nos existimos para mudar isso.
          </p>
          <Link href="/register"
            className="btn-primary inline-flex items-center gap-3 px-10 py-4 rounded-lg text-lg font-bold">
            Comecar agora
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-sm text-gray-dark mt-6">
            Gratis. Sem cartao.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-light py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <span className="text-xs text-gray-dark">Aprova.ai</span>
          <div className="flex items-center gap-4 text-xs text-gray-dark">
            <Link href="/login" className="hover:text-gray transition-colors">Entrar</Link>
            <Link href="/register" className="hover:text-gray transition-colors">Criar Conta</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
