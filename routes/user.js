import express from "express";
import {
  getBalance,
  getDashboard,
  getUser,
  getUsers,
  updateUser,
  getCustomers,
  getAdminDashboard,
} from "../controllers/user.js";
import { verifyToken } from "../middlewares/auth.js";
import { updatePassword } from "../controllers/auth.js";

const router = express.Router();
router.get("/all", verifyToken, getUsers);
router.get("/customers", verifyToken, getCustomers);
router.get("/dashboard-admin", verifyToken, getAdminDashboard);
router.get("/dashboard/:id", verifyToken, getDashboard);
router.get("/balance/:id", verifyToken, getBalance);
router.get("/:id", getUser);

router.patch("/update/:id", verifyToken, updateUser);
router.patch("/changepassword/:id", verifyToken, updatePassword);

export default router;
