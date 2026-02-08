"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface CopilotChatProps {
  editalId: string;
}

const SUGGESTIONS = [
  "Como posso melhorar meu score?",
  "Quais campos estao mais fracos?",
  "Sugira palavras-chave para o Objeto",
  "O orcamento esta equilibrado?",
];

export function CopilotChat({ editalId }: CopilotChatProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || streaming) return;

    const userMsg: Message = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setStreaming(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ editalId, messages: newMessages }),
      });

      if (!res.ok) {
        const err = await res.json();
        setMessages((prev) => [...prev, { role: "assistant", content: `Erro: ${err.error || "Falha na conexao"}` }]);
        setStreaming(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        setStreaming(false);
        return;
      }

      const decoder = new TextDecoder();
      let assistantText = "";
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                assistantText += parsed.text;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { role: "assistant", content: assistantText };
                  return updated;
                });
              }
            } catch {
              // ignore parse errors on partial chunks
            }
          }
        }
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [...prev, { role: "assistant", content: "Erro de conexao. Tente novamente." }]);
    } finally {
      setStreaming(false);
    }
  }, [editalId, messages, streaming]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-royal hover:bg-royal-dark text-white px-4 py-3 rounded-full shadow-lg shadow-royal/25 transition-all hover:scale-105 cursor-pointer"
      >
        <Sparkles className="w-5 h-5" />
        <span className="text-sm font-medium hidden sm:inline">Copilot IA</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] h-[520px] max-h-[calc(100vh-100px)] bg-navy-900 border border-navy-700 rounded-xl shadow-2xl flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-navy-700">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-royal-light" />
          <span className="text-sm font-semibold text-white">Copilot IA</span>
        </div>
        <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-xs text-slate-400 text-center">
              Consultor IA que conhece cada detalhe do seu edital. Pergunte qualquer coisa!
            </p>
            <div className="space-y-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="w-full text-left px-3 py-2 rounded-lg bg-navy-800 hover:bg-navy-700 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-royal text-white"
                  : "bg-navy-800 text-slate-200"
              }`}
            >
              {msg.content}
              {streaming && i === messages.length - 1 && msg.role === "assistant" && (
                <span className="inline-block w-1.5 h-4 bg-royal-light ml-0.5 animate-pulse" />
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-navy-700">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pergunte sobre seu edital..."
            disabled={streaming}
            className="flex-1 bg-navy-800 border border-navy-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-royal"
          />
          <Button type="submit" size="sm" disabled={!input.trim() || streaming} className="px-3">
            {streaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </form>
    </div>
  );
}
