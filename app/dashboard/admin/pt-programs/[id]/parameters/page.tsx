"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Parameter {
  _id?: string;
  parameterName: string;
  testMethod: string;
  minRange: number;
  maxRange: number;
  accreditationStatus: string;
  referenceParameter: string;
}

const ACCREDITATION_OPTIONS = [
  "Accredited",
  "Non-Accredited",
  "Applied for Accreditation",
  "Under Review",
  "Suspended",
];
export default function ParameterPage() {
  const params = useParams();
  const id = params?.id as string; // ✅ FIXED

  const [programName, setProgramName] = useState("");
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [form, setForm] = useState<Parameter>({
    parameterName: "",
    testMethod: "",
    minRange: 0,
    maxRange: 0,
    accreditationStatus: "",
    referenceParameter: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch program
  const fetchProgram = async () => {
    if (!id) return;

    const res = await fetch(`/api/admin/pt-programs/${id}`);
    if (!res.ok) return;

    const data = await res.json();
    setProgramName(data?.programName || "");
    setParameters(data?.parameters || []);
  };

  useEffect(() => {
    fetchProgram();
  }, [id]);

  // Add or Update Parameter
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const url = editingId
      ? `/api/admin/pt-programs/${id}/parameters/${editingId}`
      : `/api/admin/pt-programs/${id}/parameters`;

    await fetch(url, {
      method: editingId ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json", // ✅ FIXED
      },
      body: JSON.stringify(form),
    });

    resetForm();
    fetchProgram();
  };

  const resetForm = () => {
    setForm({
      parameterName: "",
      testMethod: "",
      minRange: 0,
      maxRange: 0,
      accreditationStatus: "",
      referenceParameter: "",
    });
    setEditingId(null);
  };

  // Delete Parameter
  const deleteParameter = async (paramId: string) => {
    if (!id) return;

    await fetch(`/api/admin/pt-programs/${id}/parameters/${paramId}`, {
      method: "DELETE",
    });

    fetchProgram();
  };

  // Edit Parameter (SAFE VERSION)
  const editParameter = (param: Parameter) => {
    setForm({
      parameterName: param.parameterName,
      testMethod: param.testMethod,
      minRange: param.minRange,
      maxRange: param.maxRange,
      accreditationStatus: param.accreditationStatus,
      referenceParameter: param.referenceParameter,
    });

    setEditingId(param._id || null);
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#001f3f] to-[#0077b6] text-white">
      <h1 className="text-2xl font-bold mb-6"><Link href={"/dashboard/admin/pt-programs"} className="hover:underline">Parameters</Link> - {programName}</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#012a4a] p-6 rounded-lg mb-8"
      >
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Parameter Name"
            className="p-2 rounded text-black"
            value={form.parameterName}
            onChange={(e) =>
              setForm({ ...form, parameterName: e.target.value })
            }
            required
          />

          <input
            type="text"
            placeholder="Test Method"
            className="p-2 rounded text-black"
            value={form.testMethod}
            onChange={(e) => setForm({ ...form, testMethod: e.target.value })}
          />

          <input
            type="number"
            placeholder="Min Range"
            className="p-2 rounded text-black"
            value={form.minRange}
            onChange={(e) =>
              setForm({ ...form, minRange: Number(e.target.value) })
            }
          />

          <input
            type="number"
            placeholder="Max Range"
            className="p-2 rounded text-black"
            value={form.maxRange}
            onChange={(e) =>
              setForm({ ...form, maxRange: Number(e.target.value) })
            }
          />

          <select
            className="p-2 rounded text-black"
            value={form.accreditationStatus}
            onChange={(e) =>
              setForm({
                ...form,
                accreditationStatus: e.target.value,
              })
            }
            required
          >
            <option value="">Select Accreditation Status</option>
            {ACCREDITATION_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Reference Parameter"
            className="p-2 rounded text-black"
            value={form.referenceParameter}
            onChange={(e) =>
              setForm({
                ...form,
                referenceParameter: e.target.value,
              })
            }
          />
        </div>

        <button className="mt-4 bg-cyan-500 px-4 py-2 rounded hover:bg-cyan-600 transition">
          {editingId ? "Update Parameter" : "Add Parameter"}
        </button>
      </form>

      {/* Table */}
      <div className="bg-[#013a63] rounded-lg p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cyan-400">
              <th className="py-2 text-left">Name</th>
              <th>Method</th>
              <th>Range</th>
              <th>Status</th>
              <th>Reference</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {parameters.map((param) => (
              <tr key={param._id} className="border-b border-gray-600">
                <td className="py-2">{param.parameterName}</td>
                <td>{param.testMethod}</td>
                <td>
                  {param.minRange} - {param.maxRange}
                </td>
                <td>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      param.accreditationStatus==="Accredited"
                        ? "bg-green-600"
                        : "bg-yellow-600"
                    }`}
                  >
                    {param.accreditationStatus}
                  </span>
                </td>
                <td>{param.referenceParameter}</td>
                <td className="space-x-2">
                  <button
                    onClick={() => editParameter(param)}
                    className="bg-yellow-500 px-2 py-1 rounded text-black"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteParameter(param._id as string)}
                    className="bg-red-500 px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {parameters.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  No parameters added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
