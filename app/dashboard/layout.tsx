import Sidebar from "@/components/Sidebar";
import SidebarServer from "@/components/SidebarServer";
import Topbar from "@/components/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0b1220] text-white grid grid-cols-10">
      <SidebarServer />

      <div className="flex-1 flex flex-col col-span-8">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
