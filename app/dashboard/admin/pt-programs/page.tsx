"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface PTProgram {
  _id?: string;
  programName: string;
  schemeCode: string;
  dispatchDate?: string;
  lastDateOfConsent?: string;
  fees: number;
}

type MessageType = "success" | "error" | null;

export default function PTProgramsPage() {
  const [programs, setPrograms] = useState<PTProgram[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<MessageType>(null);

  const [form, setForm] = useState<PTProgram>({
    programName: "",
    schemeCode: "",
    dispatchDate: "",
    lastDateOfConsent: "",
    fees: 0,
  });

  const showMessage = (text: string, type: MessageType) => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage(null);
      setMessageType(null);
    }, 3000);
  };

  const formatDate = (date?: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/pt-programs");
      const data = await res.json();
      setPrograms(data || []);
    } catch (err) {
      showMessage("Failed to fetch programs", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const url = editingId
        ? `/api/admin/pt-programs/${editingId}`
        : `/api/admin/pt-programs`;

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      showMessage(
        editingId
          ? "PT Program updated successfully ✅"
          : "PT Program added successfully ✅",
        "success"
      );

      resetForm();
      fetchPrograms();
    } catch {
      showMessage("Operation failed ❌", "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteProgram = async (id: string) => {
    if (!confirm("Are you sure you want to delete this PT Program?"))
      return;

    try {
      setLoading(true);

      const res = await fetch(`/api/admin/pt-programs/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      showMessage("PT Program deleted successfully 🗑️", "success");
      fetchPrograms();
    } catch {
      showMessage("Delete failed ❌", "error");
    } finally {
      setLoading(false);
    }
  };

  const editProgram = (prog: PTProgram) => {
    setForm({
      programName: prog.programName,
      schemeCode: prog.schemeCode,
      dispatchDate: prog.dispatchDate?.split("T")[0] || "",
      lastDateOfConsent:
        prog.lastDateOfConsent?.split("T")[0] || "",
      fees: prog.fees,
    });

    setEditingId(prog._id || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setForm({
      programName: "",
      schemeCode: "",
      dispatchDate: "",
      lastDateOfConsent: "",
      fees: 0,
    });
    setEditingId(null);
  };

  return (
    <div className="p-6 text-white bg-gradient-to-br from-[#001f3f] to-[#0077b6] min-h-screen">
      <h1 className="text-2xl font-bold mb-6">PT Programs</h1>

      {message && (
        <div
          className={`mb-4 px-4 py-3 rounded font-medium transition-all ${
            messageType === "success"
              ? "bg-green-600"
              : "bg-red-600"
          }`}
        >
          {message}
        </div>
      )}

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#012a4a] p-6 rounded-lg mb-8"
      >
        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Program Name"
            value={form.programName}
            className="p-2 rounded text-black"
            onChange={(e) =>
              setForm({ ...form, programName: e.target.value })
            }
            required
          />

          <input
            placeholder="Scheme Code"
            value={form.schemeCode}
            className="p-2 rounded text-black"
            onChange={(e) =>
              setForm({ ...form, schemeCode: e.target.value })
            }
            required
          />

          <input
            type="date"
            value={form.dispatchDate}
            className="p-2 rounded text-black"
            onChange={(e) =>
              setForm({ ...form, dispatchDate: e.target.value })
            }
          />

          <input
            type="date"
            value={form.lastDateOfConsent}
            className="p-2 rounded text-black"
            onChange={(e) =>
              setForm({
                ...form,
                lastDateOfConsent: e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Fees"
            value={form.fees}
            className="p-2 rounded text-black"
            onChange={(e) =>
              setForm({
                ...form,
                fees: Number(e.target.value),
              })
            }
          />
        </div>

        <div className="mt-4 flex gap-3">
          <button
            disabled={loading}
            className="bg-cyan-500 px-4 py-2 rounded hover:bg-cyan-600 disabled:opacity-50"
          >
            {editingId
              ? "Update PT Program"
              : "Add PT Program"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : programs.length === 0 ? (
        <p className="text-gray-300">
          No PT Programs Added Yet.
        </p>
      ) : (
        <div className="space-y-4">
          {programs.map((prog) => (
            <div
              key={prog._id}
              className="bg-[#013a63] p-4 rounded flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold text-lg">
                  {prog.programName}
                </h2>
                <p>Scheme: {prog.schemeCode}</p>
                <p>Dispatch: {formatDate(prog.dispatchDate)}</p>
                <p>
                  Last Consent:{" "}
                  {formatDate(prog.lastDateOfConsent)}
                </p>
                <p>Fees: ₹{prog.fees}</p>
              </div>

              <div className="flex gap-3">
                <Link
                  href={`/dashboard/admin/pt-programs/${prog._id}/parameters`}
                  className="bg-teal-500 px-3 py-1 rounded"
                >
                  Parameters
                </Link>

                <button
                  onClick={() => editProgram(prog)}
                  className="bg-yellow-500 px-3 py-1 rounded text-black"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    deleteProgram(prog._id!)
                  }
                  className="bg-red-500 px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}