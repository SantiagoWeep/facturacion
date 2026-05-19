import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware";

import {
    obtenerVentas,
    obtenerVentaDetalle,
    obtenerVentaPrint
} from "../controllers/adminVentasController";

const router = Router();

router.get("/dashboard", verifyToken, (req, res) => {
    res.render("admin/dashboard");
});

router.get("/ventas", verifyToken, obtenerVentas);

router.get("/ventas/:id", verifyToken, obtenerVentaDetalle);

// Nueva ruta para imprimir ticket limpio
router.get("/ventas/:id/print", verifyToken, obtenerVentaPrint);

export default router;