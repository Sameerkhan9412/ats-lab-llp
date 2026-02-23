"use client";

import { useEffect, useState } from "react";

export default function PurchasesPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/orders/purchases")
      .then((res) => res.json())
      .then(setOrders);
  }, []);

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">
        Purchased Programs
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-600">
          <thead className="bg-[#013a63]">
            <tr>
              <th className="p-3 border">S.No</th>
              <th className="p-3 border">Order ID</th>
              <th className="p-3 border">Order Date</th>
              <th className="p-3 border">Order Status</th>
              <th className="p-3 border">Payment Status</th>
              <th className="p-3 border">PT Program</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order, index) => (
              <tr
                key={order._id}
                className="text-center bg-[#001d3d]"
              >
                <td className="p-3 border">
                  {index + 1}
                </td>

                <td className="p-3 border">
                  {order.razorpayOrderId}
                </td>

                <td className="p-3 border">
                  {new Date(
                    order.createdAt
                  ).toLocaleDateString()}
                </td>

                <td className="p-3 border">
                  {order.status || "Completed"}
                </td>

                <td className="p-3 border">
                  {order.paymentStatus}
                </td>

                <td className="p-3 border">
                  {order.items.map(
                    (item: any, i: number) => (
                      <div key={i}>
                        {item.programName}
                      </div>
                    )
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <p className="mt-4 text-gray-400">
          No purchases found.
        </p>
      )}
    </div>
  );
}