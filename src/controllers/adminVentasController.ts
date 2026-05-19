import { Request, Response } from "express";
import pool from "../config/db";

export const obtenerVentas = async (req: Request, res: Response) => {
    try {
        const [ventas]: any = await pool.query(`
            SELECT id, total, metodo_pago, estado, fecha
            FROM ventas 
            ORDER BY id DESC
        `);

        res.render("admin/ventas", { ventas });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error cargando ventas");
    }
};

export const obtenerVentaDetalle = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const [ventas]: any = await pool.query("SELECT * FROM ventas WHERE id = ?", [id]);
        const [detalles]: any = await pool.query("SELECT * FROM detalle_venta WHERE venta_id = ?", [id]);

        res.render("admin/venta-detalle", { venta: ventas[0], detalles });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error detalle venta");
    }
};

// Nueva función para imprimir (limpia)
export const obtenerVentaPrint = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const [ventas]: any = await pool.query("SELECT * FROM ventas WHERE id = ?", [id]);
        const [detalles]: any = await pool.query("SELECT * FROM detalle_venta WHERE venta_id = ?", [id]);

        if (!ventas[0]) {
            return res.status(404).send("Venta no encontrada");
        }

        res.render('admin/venta-print', {
            venta: ventas[0],
            detalles
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al generar ticket");
    }
};