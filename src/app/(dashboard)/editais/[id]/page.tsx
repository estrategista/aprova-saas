import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { EditalTabs } from "@/components/edital/edital-tabs";

export default async function EditalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  const edital = await prisma.edital.findFirst({
    where: { id, userId: session.user.id },
    include: {
      candidato: true,
      campos: { orderBy: { ordem: "asc" } },
      criterios: true,
      orcamento: true,
      timeline: { orderBy: { dia: "asc" } },
      bonus: true,
    },
  });

  if (!edital) notFound();

  return <EditalTabs edital={JSON.parse(JSON.stringify(edital))} />;
}
