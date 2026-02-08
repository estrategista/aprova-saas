"use client";

import { useState, useEffect } from "react";
import { Settings, Save, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    cidade: "",
    area: "",
    claudeApiKey: "",
  });
  const [plan, setPlan] = useState("free");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setForm({
            name: data.user.name || "",
            email: data.user.email || "",
            cidade: data.user.cidade || "",
            area: data.user.area || "",
            claudeApiKey: data.user.claudeApiKey ? "••••••••••" : "",
          });
          setPlan(data.user.plan || "free");
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const payload: Record<string, string> = {
        name: form.name,
        cidade: form.cidade,
        area: form.area,
      };
      // Only send API key if it was changed (not masked)
      if (form.claudeApiKey && !form.claudeApiKey.startsWith("••")) {
        payload.claudeApiKey = form.claudeApiKey;
      }
      await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-5 h-5 text-royal-light" />
        <h1 className="text-xl font-bold text-white">Configuracoes</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="rounded-xl border border-navy-700 bg-navy-900 p-6 space-y-4">
          <h2 className="text-sm font-medium text-white mb-2">Dados Pessoais</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={form.email} disabled className="opacity-60" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cidade">Cidade</Label>
              <Input id="cidade" value={form.cidade} onChange={(e) => setForm((f) => ({ ...f, cidade: e.target.value }))} placeholder="Ex: Caruaru" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="area">Area de Atuacao</Label>
              <Input id="area" value={form.area} onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))} placeholder="Ex: Producao Cultural" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-navy-700 bg-navy-900 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-white">Integracao IA</h2>
            <Badge variant={plan === "pro" ? "success" : "secondary"}>{plan === "pro" ? "Pro" : "Free"}</Badge>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="apiKey">Claude API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={form.claudeApiKey}
              onChange={(e) => setForm((f) => ({ ...f, claudeApiKey: e.target.value }))}
              placeholder="sk-ant-..."
            />
            <p className="text-xs text-neutral-500">Sua chave API e encriptada e armazenada com seguranca. Obtenha em console.anthropic.com</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Salvando..." : "Salvar"}
          </Button>
          {saved && (
            <span className="flex items-center gap-1 text-sm text-green-400">
              <CheckCircle2 className="w-4 h-4" /> Salvo
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
