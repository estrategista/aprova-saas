"use client";

interface LiveScoreBadgeProps {
  predicted: 0 | 3 | 5 | 7 | 10;
  grade: "A" | "B" | "C" | "D" | "F";
}

const GRADE_COLORS: Record<string, string> = {
  A: "bg-green-500/20 text-green-400 border-green-500/30",
  B: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  C: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  D: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  F: "bg-red-500/20 text-red-400 border-red-500/30",
};

export function LiveScoreBadge({ predicted, grade }: LiveScoreBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border ${GRADE_COLORS[grade]}`}
    >
      {predicted}/{10} {grade}
    </span>
  );
}
