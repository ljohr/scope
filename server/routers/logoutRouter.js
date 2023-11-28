import express from "express";
import { logoutController } from "../controllers/logoutController.js";

const router = express.Router();

router.post("/api/sessionLogOut", logoutController);

export default router;
