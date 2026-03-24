// app/models/Order.ts

import mongoose from "mongoose";

// ─── SUB-SCHEMAS ───

const OrderItemSchema = new mongoose.Schema(
  {
    programId: String,
    programName: { type: String, required: true },
    programCode: String,
    fees: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
  },
  { _id: false }
);

const StatusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    note: { type: String, default: "" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { _id: false }
);

const ShippingSchema = new mongoose.Schema(
  {
    trackingId: String,
    carrier: String,
    estimatedDelivery: Date,
    actualDelivery: Date,
    address: String,
    city: String,
    state: String,
    pincode: String,
    contactPhone: String,
  },
  { _id: false }
);

// ─── MAIN SCHEMA ───

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    items: {
      type: [OrderItemSchema],
      required: true,
      validate: [(v: any[]) => v.length > 0, "Order must have at least one item"],
    },

    // ─── AMOUNTS ───
    subtotal: { type: Number, default: 0 },
    gstAmount: { type: Number, default: 0 },
    gstPercentage: { type: Number, default: 18 },
    discountAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },

    // ─── RAZORPAY ───
    razorpayOrderId: { type: String, index: true },
    razorpayPaymentId: { type: String, index: true },
    razorpaySignature: String,

    // ─── STATUS ───
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true,
    },

    orderStatus: {
      type: String,
      enum: [
        "placed",
        "confirmed",
        "processing",
        "dispatched",
        "in_transit",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "on_hold",
      ],
      default: "placed",
      index: true,
    },

    statusHistory: {
      type: [StatusHistorySchema],
      default: [],
    },

    // ─── SHIPPING & BILLING ───
    shipping: { type: ShippingSchema, default: {} },

    // ─── ADDITIONAL ───
    invoiceUrl: String,
    invoiceNumber: { type: String, unique: true, sparse: true },
    adminNotes: { type: String, default: "" },
    customerNotes: { type: String, default: "" },

    // ─── CANCELLATION ───
    cancellationReason: String,
    cancelledAt: Date,
    cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // ─── REFUND ───
    refundId: String,
    refundAmount: Number,
    refundedAt: Date,
    refundReason: String,
  },
  { timestamps: true }
);

// ─── INDEXES ───
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ paymentStatus: 1, orderStatus: 1 });
OrderSchema.index({ "shipping.trackingId": 1 });

// ─── MIDDLEWARE ───
// OrderSchema.pre("save", function (next) {
//   // Initialize status history on new orders
//   if (this.isNew && (!this.statusHistory || this.statusHistory.length === 0)) {
//     this.statusHistory = [{
//       status: this.orderStatus || "placed",
//       timestamp: new Date(),
//       note: "Order created",
//     }];
//   }

//   // Calculate amounts if not provided
//   if (!this.subtotal && this.items.length > 0) {
//     this.subtotal = this.items.reduce((sum, item: any) => 
//       sum + item.fees * (item.quantity || 1), 0
//     );
//   }

//   if (!this.gstAmount && this.subtotal) {
//     this.gstAmount = Math.round(this.subtotal * (this.gstPercentage || 18) / 100);
//   }

//   if (!this.totalAmount) {
//     this.totalAmount = (this.subtotal || 0) + (this.gstAmount || 0) - (this.discountAmount || 0);
//   }

//   next();
// });
OrderSchema.pre("save", function (next) {
  const doc = this as any;

  if (doc.isNew && (!doc.statusHistory || doc.statusHistory.length === 0)) {
    doc.statusHistory = [{
      status: doc.orderStatus || "placed",
      timestamp: new Date(),
      note: "Order created",
    }];
  }

  // next();
});

// ─── METHODS ───
OrderSchema.methods.addStatusHistory = function (
  status: string,
  note?: string,
  updatedBy?: any
) {
  if (!this.statusHistory) this.statusHistory = [];
  
  this.statusHistory.push({
    status,
    timestamp: new Date(),
    note: note || "",
    updatedBy,
  });
  
  this.orderStatus = status;

  // Special handling
  if (status === "delivered" && this.shipping) {
    this.shipping.actualDelivery = new Date();
  }
  
  if (status === "cancelled") {
    this.cancelledAt = new Date();
    if (updatedBy) this.cancelledBy = updatedBy;
  }

  return this.save();
};

// ─── EXPORT ───
export default mongoose.models.Order || mongoose.model("Order", OrderSchema);