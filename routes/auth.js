import express from "express";
import {
  forgotPassword,
  forgotVerify,
  login,
  signup,
  signupVerify,
} from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/signup/verify", signupVerify);
router.post("/forgot-password", forgotPassword);
router.patch("/forgot-password/verify", forgotVerify);
export default router;
