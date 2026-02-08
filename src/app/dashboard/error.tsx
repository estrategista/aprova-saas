"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 rounded-full bg-red-600/10 border border-red-600/30 flex items-center justify-center mb-6">
        <AlertTriangle className="w-8 h-8 text-red-400" />
      </div>
      <h2 className="text-xl font-bold text-white mb-2">Algo deu errado</h2>
      <p className="text-sm text-neutral-400 max-w-md mb-6">
        {error.message || "Ocorreu um erro inesperado. Tente novamente."}
      </p>
      <Button onClick={reset}>Tentar novamente</Button>
    </div>
  );
}
