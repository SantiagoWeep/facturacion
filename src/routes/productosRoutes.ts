import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware";
import {
    listarProductosView,
    crearProducto,
    eliminarProducto,
    getProductos
} from "../controllers/productosController";

const router = Router();

router.get("/", verifyToken, listarProductosView);           // → /admin/productos
router.get("/api", getProductos);                            // → /admin/productos/api

router.post("/", verifyToken, crearProducto);
router.delete("/:id", verifyToken, eliminarProducto);

export default router;