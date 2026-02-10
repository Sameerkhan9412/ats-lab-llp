"use client";

export default function ContactUsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">

      {/* PAGE TITLE */}
      <div>
        <h1 className="text-2xl font-bold text-slate-200">Contact Us</h1>
        <p className="text-sm text-slate-400 mt-1">
          Submit your queries or support requests
        </p>
      </div>

      {/* CONTACT FORM */}
      <div className="bg-[#0f172a] border border-white/10 rounded-xl p-8">
        <form className="space-y-6 max-w-xl">

          <Input label="Your Name" required defaultValue="MR. AMIT BANSAL" />
          <Input label="Your Company Name" required defaultValue="WINMET TECHNOLOGIES PRIVATE LIMITED" />
          <Input label="Your Email ID" required defaultValue="winmetms@gmail.com" />
          <Input label="Mobile No." required defaultValue="9873095653" />

          <div>
            <label className="text-xs font-semibold text-slate-400">
              Message <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Write something..."
              className="mt-1 w-full px-3 py-2 rounded-lg bg-[#0b1220]
              border border-white/10 focus:ring-2 focus:ring-cyan-400 outline-none text-sm"
            />
          </div>

          <button
            type="submit"
            className="px-8 py-3 bg-cyan-500 text-black font-bold rounded-lg hover:bg-cyan-600 transition"
          >
            Submit
          </button>

        </form>
      </div>

      {/* HISTORY TABLE */}
      <div className="bg-[#0f172a] border border-white/10 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <p className="text-sm text-slate-400">
            Showing 0 to 0 of 0 entries
          </p>

          <input
            placeholder="Search..."
            className="px-3 py-2 rounded-lg bg-[#0b1220] border border-white/10
            focus:ring-2 focus:ring-cyan-400 outline-none text-sm"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-white/10 rounded-lg overflow-hidden">
            <thead className="bg-cyan-600 text-black">
              <tr>
                <Th>S No</Th>
                <Th>Your Name</Th>
                <Th>Company</Th>
                <Th>Email</Th>
                <Th>Mobile</Th>
                <Th>Message</Th>
                <Th>Date</Th>
              </tr>
            </thead>

            <tbody className="bg-[#0b1220] text-slate-300">
              <tr>
                <td colSpan={7} className="text-center py-6 text-slate-400">
                  No data available
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-end gap-2 mt-4 text-sm">
          <button className="px-3 py-1 rounded border border-white/10 text-slate-400">
            Previous
          </button>
          <button className="px-3 py-1 rounded border border-white/10 text-slate-400">
            Next
          </button>
        </div>
      </div>

    </div>
  );
}

/* ---------- SMALL COMPONENTS ---------- */

function Input({ label, required, defaultValue }: any) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-400">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        defaultValue={defaultValue}
        className="mt-1 w-full px-3 py-2 rounded-lg bg-[#0b1220]
        border border-white/10 focus:ring-2 focus:ring-cyan-400 outline-none text-sm"
      />
    </div>
  );
}

function Th({ children }: any) {
  return (
    <th className="px-3 py-2 text-left font-semibold">
      {children}
    </th>
  );
}
