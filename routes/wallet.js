import express from "express";
import {
  createWallet,
  getWallet,
  updateWallet,
} from "../controllers/wallet.js";

const router = express.Router();

router.post("/", createWallet);
router.get("/", getWallet);
router.patch("/", updateWallet);

export default router;
