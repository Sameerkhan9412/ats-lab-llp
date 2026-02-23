import SidebarServer from "@/components/SidebarServer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#060d19] text-white flex relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#0A3D62]/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#00B4D8]/10 rounded-full blur-[150px]" />
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-[#90E0EF]/5 rounded-full blur-[120px]" />
      </div>

      {/* Grid noise texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Sidebar */}
      <SidebarServer />

      {/* Main content area */}
      <div className="flex-1 flex flex-col relative z-10 ml-[280px]">
        {/* Top gradient line */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-[#00B4D8]/40 to-transparent" />

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/5 px-8 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-slate-500">
            <span>© 2025 PT World. All rights reserved.</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              System Online
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}