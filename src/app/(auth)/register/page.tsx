"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erro ao criar conta");
        setLoading(false);
        return;
      }
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) {
        router.push("/login");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-scale-in">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-sm">A</div>
            <span className="text-lg font-semibold text-text-primary">Aprova.ai</span>
          </Link>
        </div>

        <div className="border border-border-subtle bg-bg-elevated rounded-xl p-6">
          <h1 className="text-xl font-semibold text-text-primary mb-1">Criar Conta</h1>
          <p className="text-sm text-text-muted mb-6">Comece a usar o Aprova.ai gratis</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}
            <div className="space-y-1.5">
              <label htmlFor="name" className="block text-sm font-medium text-text-secondary">Nome completo</label>
              <input id="name" type="text" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} required
                className="w-full px-3 py-2.5 rounded-lg bg-bg-surface border border-border-default text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary">Email</label>
              <input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full px-3 py-2.5 rounded-lg bg-bg-surface border border-border-default text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-text-secondary">Senha</label>
              <input id="password" type="password" placeholder="Minimo 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                className="w-full px-3 py-2.5 rounded-lg bg-bg-surface border border-border-default text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" />
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Criando conta..." : "Criar Conta"}
            </button>
          </form>

          <p className="text-sm text-text-muted text-center mt-5">
            Ja tem conta?{" "}
            <Link href="/login" className="text-accent-hover hover:underline font-medium">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
