import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    contact: { type: String, required: true }, // email OR mobile
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("OTP", otpSchema);
