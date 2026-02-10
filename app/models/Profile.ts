import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    participant: {
      name: String,
      address1: String,
      address2: String,
      country: String,
      state: String,
      city: String,
      pincode: String,
      gstin: String,
      tan: String,
      pan: String,
    },

    billing: {
      sameAsParticipant: Boolean,
      companyName: String,
      address1: String,
      address2: String,
      country: String,
      state: String,
      city: String,
      pincode: String,
      gstin: String,
      tan: String,
      pan: String,
    },

    shipping: {
      sameAs: {
        type: String, // "participant" | "billing" | "other"
      },
      personName: String,
      address1: String,
      address2: String,
      country: String,
      state: String,
      city: String,
      pincode: String,
    },

    contact: {
      name: String,
      mobile: String,
      email: String,
      alternateEmail: String,
    },

    other: {
      designation: String,
      accreditationBy: String,
      website: String,
      certificateNo: String,
    },

    disciplines: [String],

    profileCompleted: {
      type: Boolean,
      default: false,
    },
    uploads: {
      gstCertificate: String,
      accreditationCertificate: String,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Profile ||
  mongoose.model("Profile", ProfileSchema);
