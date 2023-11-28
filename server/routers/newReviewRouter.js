import express from "express";
import { newReviewController } from "../controllers/newReviewController.js";

const router = express.Router();

router.post("/api/new-review", newReviewController);

export default router;
