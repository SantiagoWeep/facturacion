import { Request, Response } from "express";
import pool from "../config/db";

export const obtenerVentas = async (
    req: Request,
    res: Response
) => {

    try {

        const [ventas]: any =
            await pool.query(`
                SELECT
                    id,
                    total,
                    metodo_pago,
                    estado,
                    fecha
                FROM ventas
                ORDER BY id DESC
            `);

        res.render(
            "admin/ventas",
            {
                ventas
            }
        );

    } catch (error) {

        console.log(error);

        res.status(500).send(
            "Error cargando ventas"
        );

    }

};


export const obtenerVentaDetalle = async (
    req: Request,
    res: Response
) => {

    try {

        const { id } = req.params;

        const [ventas]: any =
            await pool.query(
                `
                SELECT *
                FROM ventas
                WHERE id = ?
                `,
                [id]
            );

        const venta = ventas[0];

        const [detalles]: any =
            await pool.query(
                `
                SELECT *
                FROM detalle_venta
                WHERE venta_id = ?
                `,
                [id]
            );

        res.render(
            "admin/venta-detalle",
            {
                venta,
                detalles
            }
        );

    } catch (error) {

        console.log(error);

        res.status(500).send(
            "Error detalle venta"
        );

    }

};


import { imprimirTicket }
from "../utils/printer";


export const reimprimirTicket = async (
    req: Request,
    res: Response
) => {

    try {

        const { id } = req.params;

        const [ventas]: any =
            await pool.query(
                `
                SELECT *
                FROM ventas
                WHERE id = ?
                `,
                [id]
            );

        const venta = ventas[0];

        const [detalles]: any =
            await pool.query(
                `
                SELECT *
                FROM detalle_venta
                WHERE venta_id = ?
                `,
                [id]
            );

        await imprimirTicket(
            venta,
            detalles
        );

        res.redirect(
            `/admin/ventas/${id}`
        );

    } catch (error) {

        console.log(error);

        res.status(500).send(
            "Error imprimiendo ticket"
        );

    }

};