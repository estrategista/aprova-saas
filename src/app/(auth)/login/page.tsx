"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
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
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) setError("Email ou senha incorretos");
      else { router.push("/dashboard"); router.refresh(); }
    } catch { setError("Erro ao fazer login"); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-scale-in">
        <div className="text-center mb-10">
          <Link href="/" className="text-lg font-semibold text-white tracking-tight">Aprova.ai</Link>
        </div>

        <div className="border border-surface-light bg-surface rounded-xl p-7">
          <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">Entrar</h1>
          <p className="text-sm text-gray mb-7">Continue de onde parou.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg">{error}</div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm text-gray-light mb-1.5">Email</label>
              <input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full px-3 py-2.5 rounded-lg bg-black border border-gray-dark text-white placeholder:text-gray text-sm focus:outline-none focus:border-orange transition-colors" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm text-gray-light mb-1.5">Senha</label>
              <input id="password" type="password" placeholder="Sua senha" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full px-3 py-2.5 rounded-lg bg-black border border-gray-dark text-white placeholder:text-gray text-sm focus:outline-none focus:border-orange transition-colors" />
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3 rounded-lg text-sm disabled:opacity-50 flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="text-sm text-gray text-center mt-6">
            Nao tem conta? <Link href="/register" className="text-orange hover:text-orange-light transition-colors font-medium">Criar conta</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
