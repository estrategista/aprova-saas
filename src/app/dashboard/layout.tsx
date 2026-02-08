import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, LayoutDashboard, LogOut } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen bg-navy-950 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-navy-800 bg-navy-900 flex-col hidden md:flex">
        <div className="p-4 border-b border-navy-800">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-royal flex items-center justify-center text-white font-bold text-sm">A</div>
            <span className="text-lg font-bold text-white">Aprova.ai</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-navy-800 hover:text-white transition-colors">
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link href="/dashboard/editais/novo" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-navy-800 hover:text-white transition-colors">
            <Plus className="w-4 h-4" />
            Novo Edital
          </Link>
        </nav>
        <div className="p-4 border-t border-navy-800 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2 text-sm text-slate-400">
            <div className="w-6 h-6 rounded-full bg-royal/30 flex items-center justify-center text-xs text-royal-light font-medium">
              {session.user.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <span className="truncate">{session.user.name}</span>
          </div>
          <Link href="/api/auth/signout" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-500 hover:bg-navy-800 hover:text-red-400 transition-colors">
            <LogOut className="w-4 h-4" />
            Sair
          </Link>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-navy-900 border-b border-navy-800">
        <div className="flex items-center justify-between px-4 h-14">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-royal flex items-center justify-center text-white font-bold text-xs">A</div>
            <span className="text-lg font-bold text-white">Aprova.ai</span>
          </Link>
          <Link href="/dashboard/editais/novo" className="p-2 text-slate-400 hover:text-white">
            <Plus className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="md:p-8 p-4 pt-18 md:pt-8">{children}</div>
      </main>
    </div>
  );
}
