"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Plus,
  LayoutDashboard,
  LogOut,
  Settings,
  Menu,
  X,
  Radar,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/dashboard/editais/novo",
    label: "Novo Edital",
    icon: Plus,
    exact: true,
  },
  {
    href: "/dashboard/discovery",
    label: "Discovery",
    icon: Radar,
    exact: true,
  },
  {
    href: "/dashboard/settings",
    label: "Configuracoes",
    icon: Settings,
    exact: true,
  },
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
      <aside className="w-64 border-r border-white/5 bg-navy-950/80 backdrop-blur-xl flex-col hidden md:flex">
        {/* Logo */}
        <div className="p-5 border-b border-white/5">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20">
              A
            </div>
            <span className="text-lg font-bold text-white">
              Aprova<span className="text-blue-400">.ai</span>
            </span>
          </Link>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                  active
                    ? "bg-blue-500/10 text-white border border-blue-500/20 shadow-sm shadow-blue-500/5"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-blue-400" : ""}`} />
                {item.label}
                {active && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-white/5 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-400">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center text-xs text-blue-300 font-semibold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="truncate">{userName}</span>
          </div>
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:bg-red-500/5 hover:text-red-400 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Link>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="flex items-center justify-between px-4 h-14">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-blue-500/20">
              A
            </div>
            <span className="text-lg font-bold text-white">
              Aprova<span className="text-blue-400">.ai</span>
            </span>
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-slate-400 hover:text-white cursor-pointer transition-colors"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {mobileOpen && (
          <div className="border-t border-white/5 bg-navy-950/95 backdrop-blur-xl px-4 py-3 space-y-1 animate-fade-in">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                    active
                      ? "bg-blue-500/10 text-white"
                      : "text-slate-400 hover:bg-white/5"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${active ? "text-blue-400" : ""}`}
                  />
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/api/auth/signout"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
