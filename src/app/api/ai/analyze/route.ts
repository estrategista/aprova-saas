import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { analyzeText, getKeywordsForCriterio } from "@/lib/text-utils";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
  }

  const { text, criterioId, maxChars = 8000 } = await req.json();
  const keywords = getKeywordsForCriterio(criterioId || "");
  const analysis = analyzeText(text || "", keywords, maxChars);

  return NextResponse.json(analysis);
}
