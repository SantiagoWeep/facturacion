import { Router } from "express";

import { verifyToken }
from "../middlewares/authMiddleware";

import {
    obtenerVentas,
    obtenerVentaDetalle,
    reimprimirTicket
} from "../controllers/adminVentasController";

const router = Router();

router.get(
    "/dashboard",
    verifyToken,
    (req, res) => {

        res.render("admin/dashboard");

    }
);

router.get(
    "/ventas",
    verifyToken,
    obtenerVentas
);

router.get(
    "/ventas/:id",
    verifyToken,
    obtenerVentaDetalle
);

router.get(
    "/ventas/:id/imprimir",
    verifyToken,
    reimprimirTicket
);

export default router;