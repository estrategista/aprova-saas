import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SidebarNav } from "@/components/nav/sidebar-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen bg-navy-950 flex">
      <SidebarNav userName={session.user.name || "Usuario"} />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="md:p-8 p-4 pt-18 md:pt-8">{children}</div>
      </main>
    </div>
  );
}
