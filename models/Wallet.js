import mongoose from "mongoose";

const WalletSchema = new mongoose.Schema(
  {
    btcQr: {
      type: String,
      required: true,
    },
    btcWallet: {
      type: String,
      required: true,
    },
    ethQr: {
      type: String,
      required: true,
    },
    ethWallet: {
      type: String,
      required: true,
    },
    usdtQr: {
      type: String,
      required: true,
    },
    usdtWallet: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Wallet = mongoose.model("Wallet", WalletSchema);
export default Wallet;
