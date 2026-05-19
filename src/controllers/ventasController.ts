import { Request, Response } from "express";


import pool from "../config/db";

export const crearVenta = async (req: Request, res: Response) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const { carrito, metodo_pago } = req.body;

        if (!carrito || carrito.length === 0) {
            return res.status(400).json({ message: "Carrito vacío" });
        }

        let total = 0;
        carrito.forEach((item: any) => {
            total += item.precio * item.cantidad;
        });

        const [ventaResult]: any = await connection.query(
            `INSERT INTO ventas (usuario_id, subtotal, descuento, total, metodo_pago, estado)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [1, total, 0, total, metodo_pago, "FACTURADA"]
        );

        const ventaId = ventaResult.insertId;

        for (const item of carrito) {
            await connection.query(
                `INSERT INTO detalle_venta (venta_id, producto_nombre, cantidad, precio_unitario, subtotal, iva_porcentaje)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [ventaId, item.nombre, item.cantidad, item.precio, item.precio * item.cantidad, 21]
            );
        }

        await connection.commit();

        return res.json({
            success: true,
            message: "Venta guardada correctamente",
            ventaId
        });

    } catch (error) {
        await connection.rollback();
        console.log(error);
        return res.status(500).json({ message: "Error guardando venta" });
    } finally {
        connection.release();
    }
};