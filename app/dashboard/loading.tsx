export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin" />
        <p className="text-sm text-slate-400">
          Loading dashboard...
        </p>
      </div>
    </div>
  );
}
