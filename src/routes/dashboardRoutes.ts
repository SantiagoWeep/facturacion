import { Router } from "express";

import { verifyToken } from "../middlewares/authMiddleware";

import { dashboardView } from "../controllers/dashboardController";

const router = Router();

router.get("/", verifyToken, dashboardView);

export default router;