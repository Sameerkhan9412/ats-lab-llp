export default function DashboardHome() {
  return (
    <div className="bg-[#0f172a] rounded-xl border border-white/10 p-6">
      
      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button className="px-4 py-2 rounded-lg bg-cyan-500 text-black font-semibold">
          Buy New PT
        </button>
        <button className="px-4 py-2 rounded-lg bg-green-500 text-black font-semibold">
          Online Submission
        </button>
        <button className="px-4 py-2 rounded-lg bg-yellow-400 text-black font-semibold">
          My Downloads
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-cyan-500/10 text-cyan-400">
            <tr>
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Order Date</th>
              <th className="p-3 text-left">Order Status</th>
              <th className="p-3 text-left">Payment</th>
              <th className="p-3 text-left">PT Program</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-t border-white/10">
              <td className="p-3">19384</td>
              <td className="p-3">12/09/2025</td>
              <td className="p-3 text-yellow-400">
                Under Performance Evaluation
              </td>
              <td className="p-3 text-green-400">Paid</td>
              <td className="p-3">
                Metals in Soil (PTW/MSOIL/785/2025)
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
