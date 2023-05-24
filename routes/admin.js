import express from "express";
import { admin, createAdmin } from "../controllers/admin.js";

const router = express.Router();

router.post("/create-admin", createAdmin);
router.post("/admin-login", admin);

export default router;
