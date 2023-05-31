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
    // createdAt: {
    //   type: Date,
    //   default: Date.now(),
    // },
  },
  { timestamps: true }
);

OtpShema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

const Otp = mongoose.model("Otp", OtpShema);

export default Otp;