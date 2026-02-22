"use client";

import { useEffect, useState } from "react";

export default function PaymentHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then(setOrders);
  }, []);

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">
        Payment History
      </h1>

      {orders.map((order: any) => (
        <div
          key={order._id}
          className="bg-[#013a63] p-4 rounded mb-4"
        >
          <p>
            <strong>Order ID:</strong>{" "}
            {order.razorpayOrderId}
          </p>

          <p>
            <strong>Payment ID:</strong>{" "}
            {order.razorpayPaymentId}
          </p>

          <p>
            <strong>Total:</strong> ₹
            {order.totalAmount}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {order.paymentStatus}
          </p>

          <p>
            <strong>Date:</strong>{" "}
            {new Date(order.createdAt).toLocaleDateString()}
          </p>

          {order.invoiceUrl && (
            <a
              href={order.invoiceUrl}
              target="_blank"
              className="text-cyan-400 underline"
            >
              Download Invoice
            </a>
          )}
        </div>
      ))}
    </div>
  );
}