import express from "express";
import { allMajorsController } from "../controllers/allMajorsController.js";

const router = express.Router();

router.get("/api/majors", allMajorsController);

export default router;
