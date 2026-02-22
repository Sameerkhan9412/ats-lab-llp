"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ProgramDetails() {
  const { id } = useParams();
  const [program, setProgram] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/admin/pt-programs/${id}`)
      .then((res) => res.json())
      .then(setProgram);
  }, [id]);

  if (!program) return <p>Loading...</p>;

  return (
    <div className="p-6 text-white">
      <h1 className="text-xl font-bold mb-4">
        <Link href={"/dashboard/pt-programs"} className="hover:underline">PT Programs Name: </Link>{program.programName}
      </h1>

      <p>Scheme Code: {program.schemeCode}</p>
      <p>Fees: ₹{program.fees}</p>

      <h2 className="mt-6 text-lg font-semibold">Parameters</h2>

      <div className="mt-3 space-y-3">
        {program.parameters.map((param: any) => (
          <div key={param._id} className="bg-[#013a63] p-3 rounded">
            <p><strong>{param.parameterName}</strong></p>
            <p>Method: {param.testMethod}</p>
            <p>Range: {param.minRange} - {param.maxRange}</p>
            <p>Status: {param.accreditationStatus}</p>
          </div>
        ))}
      </div>
    </div>
  );
}