import { Router } from "express";

import { verifyToken } from "../middlewares/authMiddleware";

const router = Router();

router.get(
    "/nueva",
    verifyToken,
    (req, res) => {

        res.render("admin/nueva");

    }
);

export default router;