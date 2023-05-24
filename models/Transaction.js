import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: true,
    },
    emailId: {
      type: String,
      required: true,
    },
    transactionType: {
      type: String,
      required: true,
    },
    paymentMethod: String,
    amount: {
      type: Number,
      required: true,
    },
    verification: {
      type: String,
      enum: ["pending", "canceled", "approved"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;
