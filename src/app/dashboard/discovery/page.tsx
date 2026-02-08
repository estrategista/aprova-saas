import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Radar } from "lucide-react";
import { DiscoveryList } from "@/components/discovery/discovery-list";

export default async function DiscoveryPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <Radar className="w-6 h-6 text-royal-light" />
          <div>
            <h1 className="text-xl font-bold text-white">Discovery</h1>
            <p className="text-sm text-slate-400">
              Editais abertos que combinam com seu perfil, ranqueados por relevancia.
            </p>
          </div>
        </div>
      </div>

      <DiscoveryList />
    </div>
  );
}
