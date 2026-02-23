export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b1220] via-[#0e1628] to-[#0b1220] text-white px-6">
      <div className="max-w-md w-full text-center bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/10">
          <span className="text-3xl">🛠️</span>
        </div>

        <h1 className="text-2xl font-extrabold mb-3">
          Website Under Maintenance
        </h1>

        <p className="text-slate-400 text-sm mb-6">
          ATAS Laboratories LLP is currently undergoing maintenance.
          Please check back later.
        </p>

        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} ATAS Laboratories LLP
        </p>
      </div>
    </div>
  );
}
