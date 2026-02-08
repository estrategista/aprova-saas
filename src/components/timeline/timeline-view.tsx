"use client";

import { useState, useMemo } from "react";
import { CheckCircle2, Circle, Clock } from "lucide-react";

interface TaskItem { t: string; d?: string; done: boolean; }
interface TimelineDay { id: string; dia: number; titulo: string; emoji?: string | null; horas?: number | null; tasks: TaskItem[]; }

export function TimelineView({ editalId, days, prazo }: { editalId: string; days: TimelineDay[]; prazo?: string | null }) {
  const [timeline, setTimeline] = useState(days);

  const diasRestantes = useMemo(() => {
    if (!prazo) return null;
    return Math.ceil((new Date(prazo).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  }, [prazo]);

  const totalTasks = useMemo(() => {
    let total = 0, done = 0;
    timeline.forEach((day) => {
      const tasks = Array.isArray(day.tasks) ? day.tasks : [];
      total += tasks.length;
      done += tasks.filter((t: TaskItem) => t.done).length;
    });
    return { total, done };
  }, [timeline]);

  async function toggleTask(dayId: string, taskIndex: number) {
    const dayIdx = timeline.findIndex((d) => d.id === dayId);
    if (dayIdx === -1) return;
    const day = timeline[dayIdx];
    const tasks = [...(Array.isArray(day.tasks) ? day.tasks : [])];
    tasks[taskIndex] = { ...tasks[taskIndex], done: !tasks[taskIndex].done };
    const updated = [...timeline];
    updated[dayIdx] = { ...day, tasks };
    setTimeline(updated);
    try {
      await fetch(`/api/editais/${editalId}/tasks`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ dayId, tasks }) });
    } catch (err) { console.error(err); }
  }

  const progressPercent = totalTasks.total > 0 ? (totalTasks.done / totalTasks.total) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-navy-700 bg-navy-900 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-slate-400">Progresso Geral</p>
            <p className="text-2xl font-bold text-white">{totalTasks.done}/{totalTasks.total} tarefas</p>
          </div>
          {diasRestantes !== null && (
            <div className="text-right">
              <p className="text-sm text-slate-400">Prazo</p>
              <p className={`text-2xl font-bold ${diasRestantes <= 3 ? "text-red-400" : diasRestantes <= 7 ? "text-amber-400" : "text-green-400"}`}>
                {diasRestantes > 0 ? `${diasRestantes} dias` : diasRestantes === 0 ? "Hoje!" : "Vencido"}
              </p>
            </div>
          )}
        </div>
        <div className="h-3 bg-navy-800 rounded-full overflow-hidden">
          <div className="h-full bg-royal rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
        </div>
        <p className="text-xs text-slate-500 mt-1 text-right">{progressPercent.toFixed(0)}% concluido</p>
      </div>

      {timeline.length === 0 ? (
        <div className="rounded-xl border border-dashed border-navy-600 p-8 text-center">
          <Clock className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-400">Nenhuma timeline configurada</p>
        </div>
      ) : (
        <div className="space-y-3">
          {timeline.map((day) => {
            const tasks = Array.isArray(day.tasks) ? day.tasks : [];
            const doneTasks = tasks.filter((t: TaskItem) => t.done).length;
            const allDone = tasks.length > 0 && doneTasks === tasks.length;
            return (
              <div key={day.id} className={`rounded-xl border bg-navy-900 overflow-hidden ${allDone ? "border-green-600/30" : "border-navy-700"}`}>
                <div className="px-4 py-3 flex items-center justify-between border-b border-navy-800">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{day.emoji || "📋"}</span>
                    <div>
                      <h4 className="text-sm font-medium text-white">Dia {day.dia}: {day.titulo}</h4>
                      {day.horas && <span className="text-xs text-slate-500">{day.horas}h estimadas</span>}
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">{doneTasks}/{tasks.length}</span>
                </div>
                {tasks.length > 0 && (
                  <div className="divide-y divide-navy-800">
                    {tasks.map((task: TaskItem, idx: number) => (
                      <button key={idx} onClick={() => toggleTask(day.id, idx)} className="w-full flex items-start gap-3 px-4 py-2.5 text-left hover:bg-navy-800/50 transition-colors cursor-pointer">
                        {task.done ? <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" /> : <Circle className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />}
                        <div>
                          <p className={`text-sm ${task.done ? "text-slate-500 line-through" : "text-white"}`}>{task.t}</p>
                          {task.d && <p className="text-xs text-slate-500 mt-0.5">{task.d}</p>}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
