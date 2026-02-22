import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    items: Array,
    subtotal: Number,
    gstAmount: Number,
    totalAmount: Number,
    paymentId: String,
    razorpayOrderId: String,
    razorpaySignature: String,
    status: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order ||
  mongoose.model("Order", OrderSchema);