export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1220]/80 backdrop-blur">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin" />
        <p className="text-sm text-slate-300">
          Please wait...
        </p>
      </div>
    </div>
  );
}
