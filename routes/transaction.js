import express from "express";
import {
  getDeposits,
  getTransactions,
  getWithdrawals,
  withdraw,
  deposit,
  getAllTransactions,
  updateTransactions,
} from "../controllers/transaction.js";

const router = express.Router();
router.get("/all", getAllTransactions);
router.get("/:id", getTransactions);
router.get("/deposit/:id", getDeposits);
router.get("/withdrawals/:id", getWithdrawals);

router.post("/:id/deposit", deposit);
router.post("/:id/withdrawals", withdraw);

router.patch("/update", updateTransactions);

export default router;
