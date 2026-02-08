"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, LayoutDashboard, LogOut, Settings, Menu, X, Radar } from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/editais/novo", label: "Novo Edital", icon: Plus, exact: true },
  { href: "/dashboard/discovery", label: "Discovery", icon: Radar, exact: true },
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
      <aside className="w-60 border-r border-border-subtle bg-bg-base flex-col hidden md:flex">
        <div className="p-5 border-b border-border-subtle">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-xs">A</div>
            <span className="text-base font-semibold text-text-primary">Aprova.ai</span>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-bg-surface text-text-primary font-medium"
                    : "text-text-muted hover:bg-bg-hover hover:text-text-secondary"
                }`}>
                <Icon className={`w-4 h-4 ${active ? "text-accent" : ""}`} />
                {item.label}
                {active && <div className="ml-auto dot-active" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border-subtle space-y-0.5">
          <div className="flex items-center gap-2.5 px-3 py-2 text-sm text-text-muted">
            <div className="w-6 h-6 rounded-md bg-bg-surface flex items-center justify-center text-[10px] text-text-secondary font-semibold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="truncate">{userName}</span>
          </div>
          <Link href="/api/auth/signout"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-text-muted hover:bg-bg-hover hover:text-red-400 transition-colors">
            <LogOut className="w-4 h-4" /> Sair
          </Link>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-bg-base/90 backdrop-blur-sm border-b border-border-subtle">
        <div className="flex items-center justify-between px-4 h-14">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-xs">A</div>
            <span className="text-base font-semibold text-text-primary">Aprova.ai</span>
          </Link>
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-text-muted hover:text-text-primary cursor-pointer transition-colors">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-border-subtle bg-bg-base px-4 py-3 space-y-0.5 animate-fade-in">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href, item.exact);
              return (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm ${
                    active ? "bg-bg-surface text-text-primary" : "text-text-muted hover:bg-bg-hover"
                  }`}>
                  <Icon className={`w-4 h-4 ${active ? "text-accent" : ""}`} />
                  {item.label}
                </Link>
              );
            })}
            <Link href="/api/auth/signout"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-text-muted hover:text-red-400">
              <LogOut className="w-4 h-4" /> Sair
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
