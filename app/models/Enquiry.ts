// app/models/Enquiry.ts

import mongoose from "mongoose";

const EnquirySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["general", "program", "payment", "technical", "other"],
      default: "general",
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "resolved", "closed"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    adminResponse: String,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    respondedAt: Date,
    attachments: [String],
  },
  { timestamps: true }
);

export default mongoose.models.Enquiry ||
  mongoose.model("Enquiry", EnquirySchema);