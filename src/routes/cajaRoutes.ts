// src/routes/cajaRoutes.ts

import { Router } from "express";

import {
    cajaView,
    abrirCaja,
    agregarMovimiento,
    cerrarCaja
} from "../controllers/cajaController";

import {
    verifyToken
} from "../middlewares/authMiddleware";

const router = Router();

router.get(
    "/",
    verifyToken,
    cajaView
);

router.post(
    "/abrir",
    verifyToken,
    abrirCaja
);

router.post(
    "/movimiento",
    verifyToken,
    agregarMovimiento
);

router.post(
    "/cerrar",
    verifyToken,
    cerrarCaja
);

export default router;