// import mongoose from "mongoose";

// const OrderSchema = new mongoose.Schema(
//   {
//     items: Array,
//     subtotal: Number,
//     gstAmount: Number,
//     totalAmount: Number,
//     paymentId: String,
//     razorpayOrderId: String,
//     razorpaySignature: String,
//     status: {
//       type: String,
//       enum: ["Pending", "Paid", "Failed"],
//       default: "Pending",
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.models.Order ||
//   mongoose.model("Order", OrderSchema);

import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        programId: String,
        programName: String,
        fees: Number,
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    razorpayOrderId: String,
    razorpayPaymentId: String,

    paymentStatus: {
      type: String,
      enum: ["paid", "failed", "pending"],
      default: "paid",
    },

    invoiceUrl: String,
  },
  { timestamps: true }
);

export default mongoose.models.Order ||
  mongoose.model("Order", OrderSchema);