import { Request, Response } from "express";
import pool from "../config/db";

export const dashboardView = async (
    req: Request,
    res: Response
) => {

    try {

        // =========================
        // VENTAS HOY
        // =========================
        const [ventasHoy]: any = await pool.query(`
            SELECT
                COUNT(*) as cantidad,
                COALESCE(SUM(total), 0) as total
            FROM ventas
            WHERE DATE(fecha) = CURDATE()
            AND estado != 'ANULADA'
        `);

        // =========================
        // VENTAS MES
        // =========================
        const [ventasMes]: any = await pool.query(`
            SELECT
                COUNT(*) as cantidad,
                COALESCE(SUM(total), 0) as total
            FROM ventas
            WHERE MONTH(fecha) = MONTH(CURDATE())
            AND YEAR(fecha) = YEAR(CURDATE())
            AND estado != 'ANULADA'
        `);

        // =========================
        // PROMEDIO VENTA
        // =========================
        const [promedioVenta]: any = await pool.query(`
            SELECT
                COALESCE(AVG(total), 0) as promedio
            FROM ventas
            WHERE estado != 'ANULADA'
        `);

        // =========================
        // PRODUCTOS MÁS VENDIDOS
        // =========================
        const [productosTop]: any = await pool.query(`
            SELECT
                producto_nombre,
                SUM(cantidad) as total_vendidos
            FROM detalle_venta
            GROUP BY producto_nombre
            ORDER BY total_vendidos DESC
            LIMIT 5
        `);

        // =========================
        // VENTAS POR MÉTODO PAGO
        // =========================
        const [metodosPago]: any = await pool.query(`
            SELECT
                metodo_pago,
                COUNT(*) as cantidad,
                SUM(total) as total
            FROM ventas
            WHERE estado != 'ANULADA'
            GROUP BY metodo_pago
        `);

        // =========================
        // VENTAS ÚLTIMOS 7 DÍAS
        // =========================
        const [ventasSemana]: any = await pool.query(`
            SELECT
                DATE(fecha) as dia,
                SUM(total) as total
            FROM ventas
            WHERE fecha >= CURDATE() - INTERVAL 6 DAY
            AND estado != 'ANULADA'
            GROUP BY DATE(fecha)
            ORDER BY dia ASC
        `);

        // =========================
        // ÚLTIMA VENTA
        // =========================
        const [ultimaVenta]: any = await pool.query(`
            SELECT *
            FROM ventas
            ORDER BY fecha DESC
            LIMIT 1
        `);

        res.render(
            "admin/dashboard",
            {
                ventasHoy: ventasHoy[0],
                ventasMes: ventasMes[0],
                promedioVenta: promedioVenta[0],
                productosTop,
                metodosPago,
                ventasSemana,
                ultimaVenta: ultimaVenta[0]
            }
        );

    } catch (error) {

        console.log(error);

        res.status(500).send(
            "Error cargando dashboard"
        );

    }

};