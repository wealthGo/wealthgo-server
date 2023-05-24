import express from "express";

import {
  getAllTickets,
  getTickets,
  tickets,
  updateTickets,
} from "../controllers/ticket.js";

const router = express.Router();

router.post("/:id", tickets);
router.get("/all", getAllTickets);
router.get("/:id", getTickets);

router.patch("/update", updateTickets);
export default router;
