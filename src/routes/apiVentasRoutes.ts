import { Router } from "express";

import { crearVenta } from "../controllers/ventasController";

const router = Router();

router.post("/", crearVenta);

export default router;