// app/models/Complaint.ts

import mongoose from "mongoose";

const ComplaintSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    programId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PTProgram",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["delivery", "quality", "payment", "service", "technical", "other"],
      default: "other",
    },
    status: {
      type: String,
      enum: ["open", "investigating", "resolved", "rejected", "closed"],
      default: "open",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    resolution: String,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    resolvedAt: Date,
    attachments: [String],
  },
  { timestamps: true }
);

export default mongoose.models.Complaint ||
  mongoose.model("Complaint", ComplaintSchema);