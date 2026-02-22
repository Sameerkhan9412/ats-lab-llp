"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

interface PTProgram {
  _id: string;
  programName: string;
  schemeCode: string;
  dispatchDate: string;
  lastDateOfConsent: string;
  fees: number;
}

export default function PTProgramsListing() {
  const [programs, setPrograms] = useState<PTProgram[]>([]);
  const [cartCount, setCartCount] = useState(0);

  // Fetch programs
  useEffect(() => {
    fetch("/api/admin/pt-programs")
      .then((res) => res.json())
      .then(setPrograms);

    fetchCartCount();
  }, []);

  const fetchCartCount = async () => {
    const res = await fetch("/api/cart");
    const data = await res.json();
    setCartCount(data.length || 0);
  };

 const addToCart = async (program: PTProgram) => {
  const res = await fetch("/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      programId: program._id,
      programName: program.programName,
      fees: program.fees,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message); // Already added message
    return;
  }

  alert("Added to cart successfully");
  fetchCartCount();
};

  return (
    <div className="p-6 text-white">
      
      {/* Header with Cart */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">PT Programs</h1>

        <Link
          href="/dashboard/checkout"
          className="relative bg-cyan-600 px-4 py-2 rounded flex items-center gap-2"
        >
          <ShoppingCart size={18} />
          Cart

          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-2 py-1 rounded-full">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      {/* Program List */}
      <div className="grid gap-4">
        {programs.map((prog) => (
          <div
            key={prog._id}
            className="bg-[#013a63] p-4 rounded shadow"
          >
            <h2 className="text-lg font-semibold">
              {prog.programName}
            </h2>

            <p>Scheme Code: {prog.schemeCode}</p>
            <p>
              Dispatch:{" "}
              {new Date(prog.dispatchDate).toLocaleDateString()}
            </p>
            <p>
              Last Consent:{" "}
              {new Date(
                prog.lastDateOfConsent
              ).toLocaleDateString()}
            </p>
            <p className="font-semibold mt-2">
              Fees: ₹{prog.fees}
            </p>

            <div className="mt-4 flex gap-3">
              <Link
                href={`/dashboard/pt-programs/${prog._id}`}
                className="bg-teal-500 px-3 py-1 rounded hover:bg-teal-600"
              >
                View Parameters
              </Link>

              <button
                onClick={() => addToCart(prog)}
                className="bg-cyan-500 px-3 py-1 rounded hover:bg-cyan-600"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}