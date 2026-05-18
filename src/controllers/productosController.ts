import { Request, Response } from "express";

import pool from "../config/db";

export const getProductos = async (
    req: Request,
    res: Response
) => {

    try {

        const [rows] = await pool.query(
            "SELECT * FROM productos WHERE activo = 1"
        );

        return res.json(rows);

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Error obteniendo productos"
        });

    }

};