"use client";

import { useEffect, useState } from "react";

export default function DashboardHome() {
  const [companyName, setCompanyName] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile", {
          credentials: "include",
        });
        const data = await res.json();

        if (data?.profile?.participant?.name) {
          setCompanyName(data.profile.participant.name);
        }
      } catch (err) {
        console.error("Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="space-y-6">
      {/* TOP INFO BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <h1 className="text-lg font-semibold text-slate-200">
          Welcome{" "}
          <span className="text-cyan-400 font-bold">
            {companyName || "—"}
          </span>
        </h1>

        <div className="flex flex-wrap gap-4 text-sm">
          <a className="text-cyan-400 hover:underline cursor-pointer">
            Procedure For Downloading
          </a>
          <a className="text-cyan-400 hover:underline cursor-pointer">
            View User Manual
          </a>
          <a className="text-cyan-400 hover:underline cursor-pointer">
            PT Item Receiving Procedure
          </a>
          <button className="px-3 py-1.5 rounded-lg border border-cyan-400 text-cyan-400 hover:bg-cyan-400/10">
            View Lab Details
          </button>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex flex-wrap gap-3">
        <button className="px-5 py-2 rounded-lg bg-cyan-500 text-black font-semibold">
          Buy New PT
        </button>
        <button className="px-5 py-2 rounded-lg bg-green-500 text-black font-semibold">
          Online Submission
        </button>
        <button className="px-5 py-2 rounded-lg bg-yellow-400 text-black font-semibold">
          My Downloads
        </button>
      </div>

      {/* FILTERS */}
      <div className="bg-[#0f172a] rounded-xl border border-white/10 p-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="date"
            className="bg-[#0b1220] border border-white/10 rounded-lg px-4 py-2 text-sm"
          />
          <input
            type="date"
            className="bg-[#0b1220] border border-white/10 rounded-lg px-4 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Search..."
            className="bg-[#0b1220] border border-white/10 rounded-lg px-4 py-2 text-sm"
          />
          <button className="bg-cyan-500 text-black rounded-lg font-semibold">
            Search
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-[#0f172a] rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cyan-500/10 text-cyan-400">
            <tr>
              <th className="p-3 text-left">S No</th>
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Order Date</th>
              <th className="p-3 text-left">Order Status</th>
              <th className="p-3 text-left">Payment Status</th>
              <th className="p-3 text-left">PT Programs</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-t border-white/10 hover:bg-white/5">
              <td className="p-3">1</td>
              <td className="p-3">19384</td>
              <td className="p-3">12/09/2025</td>
              <td className="p-3 text-yellow-400">
                Under Performance Evaluation
              </td>
              <td className="p-3 text-green-400 font-semibold">Paid</td>
              <td className="p-3">
                Metals in Soil (PTW/MSOIL/785/2025)
              </td>
            </tr>
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="flex justify-between items-center px-4 py-3 border-t border-white/10 text-xs text-slate-400">
          <span>Showing 1 to 1 of 1 entries</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-white/10 rounded">
              Previous
            </button>
            <button className="px-3 py-1 bg-cyan-500 text-black rounded font-semibold">
              1
            </button>
            <button className="px-3 py-1 border border-white/10 rounded">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
