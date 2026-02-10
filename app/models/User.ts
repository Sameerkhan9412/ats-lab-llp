import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: String,
    email: { type: String, unique: true },
    password: String,
    signupFor: String,

    isVerified: { type: Boolean, default: false },
    otp: String,
    otpExpiry: Date,
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);
