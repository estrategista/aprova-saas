"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface OrcamentoItem {
  id: string;
  nome: string;
  valor: number;
  descricao?: string | null;
}

interface BudgetTableProps {
  editalId: string;
  items: OrcamentoItem[];
  valorTotal: number;
}

export function BudgetTable({ editalId, items: initialItems, valorTotal }: BudgetTableProps) {
  const [items, setItems] = useState(initialItems);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNome, setEditNome] = useState("");
  const [editValor, setEditValor] = useState("");
  const [newNome, setNewNome] = useState("");
  const [newValor, setNewValor] = useState("");
  const [adding, setAdding] = useState(false);

  const totalGasto = items.reduce((sum, item) => sum + item.valor, 0);
  const saldo = valorTotal - totalGasto;
  const percentUsado = valorTotal > 0 ? (totalGasto / valorTotal) * 100 : 0;

  function fmt(v: number) { return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v); }

  async function addItem() {
    if (!newNome || !newValor) return;
    setAdding(true);
    try {
      const res = await fetch(`/api/editais/${editalId}/orcamento`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nome: newNome, valor: parseFloat(newValor) }) });
      if (res.ok) { const item = await res.json(); setItems((prev) => [...prev, item]); setNewNome(""); setNewValor(""); }
    } catch (err) { console.error(err); }
    finally { setAdding(false); }
  }

  function startEdit(item: OrcamentoItem) { setEditingId(item.id); setEditNome(item.nome); setEditValor(item.valor.toString()); }

  async function saveEdit() {
    if (!editingId) return;
    try {
      const res = await fetch(`/api/editais/${editalId}/orcamento`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ itemId: editingId, nome: editNome, valor: parseFloat(editValor) }) });
      if (res.ok) { const updated = await res.json(); setItems((prev) => prev.map((i) => (i.id === editingId ? updated : i))); }
    } catch (err) { console.error(err); }
    setEditingId(null);
  }

  async function deleteItem(itemId: string) {
    try {
      const res = await fetch(`/api/editais/${editalId}/orcamento?itemId=${itemId}`, { method: "DELETE" });
      if (res.ok) setItems((prev) => prev.filter((i) => i.id !== itemId));
    } catch (err) { console.error(err); }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-navy-700 bg-navy-900 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-neutral-400">Orcamento Total</p>
            <p className="text-2xl font-bold text-white">{fmt(valorTotal)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-neutral-400">Saldo</p>
            <p className={`text-2xl font-bold ${Math.abs(saldo) < 0.01 ? "text-green-400" : saldo > 0 ? "text-amber-400" : "text-red-400"}`}>{fmt(saldo)}</p>
          </div>
        </div>
        <div className="h-3 bg-navy-800 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${percentUsado > 100 ? "bg-red-500" : percentUsado >= 99.9 ? "bg-green-500" : "bg-royal"}`} style={{ width: `${Math.min(percentUsado, 100)}%` }} />
        </div>
        <div className="flex justify-between text-xs text-neutral-500 mt-1">
          <span>{fmt(totalGasto)} usado</span>
          <span>{percentUsado.toFixed(1)}%</span>
        </div>
      </div>

      <div className="rounded-xl border border-navy-700 bg-navy-900 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-navy-700 text-left">
              <th className="px-4 py-3 text-xs font-medium text-neutral-400 uppercase">Item</th>
              <th className="px-4 py-3 text-xs font-medium text-neutral-400 uppercase text-right">Valor</th>
              <th className="px-4 py-3 text-xs font-medium text-neutral-400 uppercase text-right w-24">Acoes</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-navy-800 last:border-0">
                {editingId === item.id ? (
                  <>
                    <td className="px-4 py-2"><Input value={editNome} onChange={(e) => setEditNome(e.target.value)} className="h-8 text-sm" /></td>
                    <td className="px-4 py-2"><Input type="number" value={editValor} onChange={(e) => setEditValor(e.target.value)} className="h-8 text-sm text-right" /></td>
                    <td className="px-4 py-2 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={saveEdit} className="p-1 text-green-400 hover:text-green-300 cursor-pointer"><Check className="w-4 h-4" /></button>
                        <button onClick={() => setEditingId(null)} className="p-1 text-neutral-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3"><p className="text-sm text-white">{item.nome}</p>{item.descricao && <p className="text-xs text-neutral-500">{item.descricao}</p>}</td>
                    <td className="px-4 py-3 text-sm text-white text-right font-mono">{fmt(item.valor)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => startEdit(item)} className="p-1 text-neutral-400 hover:text-white cursor-pointer"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => deleteItem(item.id)} className="p-1 text-neutral-400 hover:text-red-400 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
            <tr className="bg-navy-800/30">
              <td className="px-4 py-2"><Input placeholder="Nome do item" value={newNome} onChange={(e) => setNewNome(e.target.value)} className="h-8 text-sm" /></td>
              <td className="px-4 py-2"><Input type="number" placeholder="0.00" value={newValor} onChange={(e) => setNewValor(e.target.value)} className="h-8 text-sm text-right" /></td>
              <td className="px-4 py-2 text-right"><Button size="sm" onClick={addItem} disabled={adding || !newNome || !newValor}><Plus className="w-3 h-3" /></Button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
