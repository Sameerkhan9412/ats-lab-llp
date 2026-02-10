"use client";

import { useState } from "react";

export default function RaiseComplaint() {
  const [type, setType] = useState<"general" | "pt">("general");

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      
      {/* Header */}
      <div className="mb-10 border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-semibold text-white">
          Raise Complaints
        </h1>
      </div>

      {/* Form */}
      <form className="space-y-10">

        {/* Nature of Complaint */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <label className="text-sm font-medium text-slate-700">
            Nature of Complaint <span className="text-red-500">*</span>
          </label>

          <div className="md:col-span-2 flex gap-10">
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="radio"
                name="nature"
                checked={type === "general"}
                onChange={() => setType("general")}
                className="accent-blue-600"
              />
              General
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="radio"
                name="nature"
                checked={type === "pt"}
                onChange={() => setType("pt")}
                className="accent-blue-600"
              />
              PT Program
            </label>
          </div>
        </div>

        {/* PT Program (Only when PT selected) */}
        {type === "pt" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
            <label className="text-sm font-medium text-slate-700">
              PT Program <span className="text-red-500">*</span>
            </label>

            <div className="md:col-span-2 ">
              <select
                className="
                  w-full rounded-lg
                  border border-slate-300
                  px-4 py-2.5 text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-900
                "
              >
                <option value="">Select PT Program</option>
                <option>Metals in Soil</option>
                <option>Water Testing</option>
                <option>Environmental PT</option>
              </select>
            </div>
          </div>
        )}

        {/* Description */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <label className="text-sm font-medium text-slate-700">
            Description of the complaint <span className="text-red-500">*</span>
          </label>

          <div className="md:col-span-2">
            <textarea
              rows={4}
              placeholder="Explain the issue clearly..."
              className="
                w-full rounded-lg
                border border-slate-300
                px-4 py-3 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500
              "
            />
          </div>
        </div>

        {/* Evidence */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <label className="text-sm font-medium text-slate-700">
            Upload supporting evidence? <span className="text-red-500">*</span>
          </label>

          <div className="md:col-span-2 flex gap-10">
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="radio" name="evidence" className="accent-blue-600" />
              Yes
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="radio"
                name="evidence"
                defaultChecked
                className="accent-blue-600"
              />
              No
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6 flex justify-end">
          <button
            type="submit"
            className="
              rounded-md bg-blue-600
              px-8 py-2.5
              text-sm font-semibold text-white
              hover:bg-blue-700
              transition
            "
          >
            Submit
          </button>
        </div>

      </form>
    </div>
  );
}
