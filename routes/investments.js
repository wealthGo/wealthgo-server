import express from "express";
import { getInvestments, invest } from "../controllers/investment.js";

const router = express.Router();

router.post("/", invest);
router.get("/:id", getInvestments);

export default router;
