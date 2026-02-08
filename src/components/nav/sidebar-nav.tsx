"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, LayoutDashboard, LogOut, Settings, Menu, X } from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/editais/novo", label: "Novo Edital", icon: Plus, exact: true },
  { href: "/dashboard/settings", label: "Configuracoes", icon: Settings, exact: true },
];

export function SidebarNav({ userName }: { userName: string }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 border-r border-navy-800 bg-navy-900 flex-col hidden md:flex">
        <div className="p-4 border-b border-navy-800">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-royal flex items-center justify-center text-white font-bold text-sm">A</div>
            <span className="text-lg font-bold text-white">Aprova.ai</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${active ? "bg-royal/20 text-white border border-royal/30" : "text-slate-300 hover:bg-navy-800 hover:text-white"}`}>
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-navy-800 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2 text-sm text-slate-400">
            <div className="w-6 h-6 rounded-full bg-royal/30 flex items-center justify-center text-xs text-royal-light font-medium">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="truncate">{userName}</span>
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
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-slate-400 hover:text-white cursor-pointer">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {mobileOpen && (
          <div className="border-t border-navy-800 bg-navy-900 px-4 py-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href, item.exact);
              return (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${active ? "bg-royal/20 text-white" : "text-slate-300 hover:bg-navy-800"}`}>
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
            <Link href="/api/auth/signout" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-500 hover:text-red-400">
              <LogOut className="w-4 h-4" />
              Sair
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
