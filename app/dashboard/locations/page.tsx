"use client";

import { Pencil, Plus } from "lucide-react";

export default function LocationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1220] to-[#020617] px-6 py-10">

      {/* WRAPPER */}
      <div className="max-w-[1600px]">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Locations</h1>
            <p className="text-sm text-slate-400">
              Manage laboratory locations and contact details
            </p>
          </div>

          <button
            className="
              inline-flex items-center gap-2
              rounded-lg bg-teal-500 px-5 py-2.5
              text-sm font-semibold text-black
              hover:bg-teal-400 transition
            "
          >
            <Plus size={16} />
            Add Location
          </button>
        </div>

        {/* CARD */}
        <div className="rounded-xl bg-[#0b1220] border-white/10 shadow-xl">

          {/* CONTROLS */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-6 py-4 border-b">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              Show
              <select className="rounded-md border px-2 py-1">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              entries
            </div>

            <input
              type="text"
              placeholder="Search location..."
              className="
                w-full lg:w-72
                rounded-md border
                px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-teal-500
              "
            />
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="min-w-[1800px] w-full text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  {[
                    "#",
                    "Lab Name",
                    "Address Line 1",
                    "Address Line 2",
                    "Country",
                    "State",
                    "City",
                    "Pin",
                    "Contact Person",
                    "Mobile",
                    "Email",
                    "Alt Email",
                    "PAN",
                    "TIN",
                    "GSTIN",
                    "Designation",
                    "Accredited By",
                    "Certificate No",
                    "Field",
                    "Website",
                    "Action",
                  ].map((head) => (
                    <th key={head} className="px-4 py-3 text-left whitespace-nowrap">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y">
                <tr className="">
                  <td className="px-4 py-3">1</td>
                  <td className="px-4 py-3 font-medium">
                    WINMET TECHNOLOGIES PRIVATE LIMITED
                  </td>
                  <td className="px-4 py-3">E-65, Site IV</td>
                  <td className="px-4 py-3">Near Radisson Blue</td>
                  <td className="px-4 py-3">India</td>
                  <td className="px-4 py-3">Uttar Pradesh</td>
                  <td className="px-4 py-3">Greater Noida</td>
                  <td className="px-4 py-3">201306</td>
                  <td className="px-4 py-3">Mr. Amit Bansal</td>
                  <td className="px-4 py-3">9873095653</td>
                  <td className="px-4 py-3">winmetms@gmail.com</td>
                  <td className="px-4 py-3">—</td>
                  <td className="px-4 py-3">AAACW7903M</td>
                  <td className="px-4 py-3">—</td>
                  <td className="px-4 py-3">09AAACW7903M1ZV</td>
                  <td className="px-4 py-3">Technical Manager</td>
                  <td className="px-4 py-3">NABL</td>
                  <td className="px-4 py-3">N/A</td>
                  <td className="px-4 py-3">Chemical</td>
                  <td className="px-4 py-3">—</td>
                  <td className="px-4 py-3 text-center">
                    <button className="rounded-md border p-2 hover:bg-slate-100">
                      <Pencil size={16} />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* FOOTER */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-4 border-t text-sm text-slate-600">
            <span>Showing 1 to 1 of 1 entries</span>

            <div className="flex gap-2">
              <button className="rounded-md border px-3 py-1">Previous</button>
              <button className="rounded-md bg-blue-600 px-3 py-1 text-white">
                1
              </button>
              <button className="rounded-md border px-3 py-1">Next</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
