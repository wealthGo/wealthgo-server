import mongoose from "mongoose";

const InvestmentSchema = new mongoose.Schema(
  {
    planName: {
      type: String,
      required: true,
    },
    customerId: {
      type: String,
      required: true,
    },
    emailId: {
      type: String,
      required: true,
    },

    investAmount: {
      type: Number,
      required: true,
    },
    interest: {
      type: Number,
      default: 0,
    },
    paymentStat: {
      type: String,
      enum: ["success", "failed"],
      default: "success",
    },
    active: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    expirationTime: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Investment = mongoose.model("Investment", InvestmentSchema);
export default Investment;
