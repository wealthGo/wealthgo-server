import mongoose from "mongoose";

const OtpShema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      max: 50,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: { type: Date, default: Date.now(), index: { expires: 10000 } },
  },
  { timestamps: true }
);

const Otp = mongoose.model("Otp", OtpShema);
export default Otp;
