import Wallet from "../models/Wallet.js";

export const getWallet = async (req, res) => {
  try {
    const wallet = await Wallet.find();
    if (!wallet) return null;
    res.status(200).json(wallet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createWallet = async (req, res) => {
  try {
    const { btcQr, btcWallet, ethQr, ethWallet, usdtQr, usdtWallet } = req.body;
    const wallet = new Wallet({
      btcQr,
      btcWallet,
      ethQr,
      ethWallet,
      usdtQr,
      usdtWallet,
    });

    const savedWallet = await wallet.save();
    res.status(201).json(savedWallet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateWallet = async (req, res) => {
  try {
    const { walletId, btcQr, btcWallet, ethQr, ethWallet, usdtQr, usdtWallet } =
      req.body;
    const update = { btcQr, btcWallet, ethQr, ethWallet, usdtQr, usdtWallet };
    const filter = walletId;

    const updatedWallet = await Wallet.findByIdAndUpdate(walletId, update);
    if (!updateWallet)
      return res.status(400).json({ message: "something went wrong" });
    const wallet = await Wallet.find();
    res.status(200).json(wallet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
