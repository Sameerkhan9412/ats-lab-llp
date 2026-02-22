"use client";

import { useEffect, useState } from "react";

interface CartItem {
  _id: string;
  programId: string;
  programName: string;
  fees: number;
}

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const res = await fetch("/api/cart");
    const data = await res.json();
    setItems(data);
  };

  // Calculations
  const subtotal = items.reduce(
    (acc, item) => acc + item.fees,
    0
  );

  const GST_RATE = 0.18;
  const gstAmount = subtotal * GST_RATE;
  const total = subtotal + gstAmount;

  // Load Razorpay Script
  const loadScript = () =>
    new Promise((resolve) => {
      if (document.getElementById("razorpay-script")) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayment = async () => {
    if (items.length === 0) return;

    setLoading(true);

    const scriptLoaded = await loadScript();
    if (!scriptLoaded) {
      alert("Razorpay SDK failed to load.");
      setLoading(false);
      return;
    }

    const orderRes = await fetch(
      "/api/payment/create-order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: total }),
      }
    );

    const order = await orderRes.json();

    const options = {
      key: process.env
        .NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
      amount: order.amount,
      currency: "INR",
      order_id: order.id,
      name: "PT Program Purchase",
      description: "PT Program Payment",
      handler: async function (response: any) {
        const verifyRes = await fetch(
          "/api/payment/verify",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_order_id:
                response.razorpay_order_id,
              razorpay_payment_id:
                response.razorpay_payment_id,
              razorpay_signature:
                response.razorpay_signature,
              orderData: {
                items,
                subtotal,
                gstAmount,
                totalAmount: total,
              },
            }),
          }
        );

        const result = await verifyRes.json();

        if (result.success) {
          await fetch("/api/cart/clear", {
            method: "DELETE",
          });

          window.location.href =
            "/dashboard/order-success";
        } else {
          alert("Payment verification failed");
        }
      },
      theme: {
        color: "#0ea5e9",
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();

    setLoading(false);
  };

  const removeItem = async (id: string) => {
    await fetch(`/api/cart/${id}`, {
      method: "DELETE",
    });
    fetchCart();
  };

  return (
    <div className="p-6 text-white min-h-screen bg-gradient-to-br from-[#001f3f] to-[#0077b6]">
      <h1 className="text-2xl font-bold mb-6">
        Checkout
      </h1>

      {items.length === 0 ? (
        <p className="text-gray-300">
          Your cart is empty.
        </p>
      ) : (
        <>
          {/* Cart Items */}
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-[#013a63] p-4 rounded flex justify-between items-center"
              >
                <div>
                  <h2 className="font-semibold">
                    {item.programName}
                  </h2>
                </div>

                <div className="font-semibold">
                  ₹{item.fees}
                </div>

                <button
                  onClick={() =>
                    removeItem(item._id)
                  }
                  className="text-red-400 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-6 bg-[#012a4a] p-6 rounded">
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>
                ₹{subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between mb-2">
              <span>GST (18%):</span>
              <span>
                ₹{gstAmount.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between font-bold text-lg border-t border-gray-500 pt-2">
              <span>Total:</span>
              <span>
                ₹{total.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="bg-green-600 px-6 py-2 rounded mt-4 w-full hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}