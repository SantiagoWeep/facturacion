// src/controllers/cajaController.ts

import { Response } from "express";
import pool from "../config/db";
import { AuthRequest } from "../middlewares/authMiddleware";

// ===============================
// VISTA CAJA
// ===============================
export const cajaView = async (
    req: AuthRequest,
    res: Response
) => {

    try {

        // Buscar caja abierta
        const [cajas]: any = await pool.query(`
            SELECT
                c.*,
                u.nombre as usuario_nombre
            FROM caja c
            INNER JOIN usuarios u
                ON u.id = c.usuario_apertura_id
            WHERE c.estado = 'ABIERTA'
            LIMIT 1
        `);

        const caja = cajas[0];

        // Si no hay caja abierta
        if (!caja) {

            return res.render(
                "admin/caja",
                {
                    caja: null,
                    movimientos: []
                }
            );

        }

        // Movimientos
        const [movimientos]: any = await pool.query(`
            SELECT
                mc.*,
                u.nombre as usuario_nombre
            FROM movimientos_caja mc
            INNER JOIN usuarios u
                ON u.id = mc.usuario_id
            WHERE mc.caja_id = ?
            ORDER BY mc.fecha DESC
        `, [caja.id]);

        // Total ingresos
        const [ingresos]: any = await pool.query(`
            SELECT
                COALESCE(SUM(monto), 0) as total
            FROM movimientos_caja
            WHERE caja_id = ?
            AND tipo = 'INGRESO'
        `, [caja.id]);

        // Total egresos
        const [egresos]: any = await pool.query(`
            SELECT
                COALESCE(SUM(monto), 0) as total
            FROM movimientos_caja
            WHERE caja_id = ?
            AND tipo = 'EGRESO'
        `, [caja.id]);

        // Dinero esperado
        const dineroEsperado =
            Number(caja.monto_inicial)
            + Number(caja.ventas_efectivo)
            + Number(ingresos[0].total)
            - Number(egresos[0].total);

        res.render(
            "admin/caja",
            {
                caja,
                movimientos,
                ingresos: ingresos[0].total,
                egresos: egresos[0].total,
                dineroEsperado
            }
        );

    } catch (error) {

        console.log(error);

        res.status(500).send("Error caja");

    }

};

// ===============================
// ABRIR CAJA
// ===============================
export const abrirCaja = async (
    req: AuthRequest,
    res: Response
) => {

    try {

        const { monto_inicial } = req.body;

        const [cajaAbierta]: any = await pool.query(`
            SELECT id
            FROM caja
            WHERE estado = 'ABIERTA'
            LIMIT 1
        `);

        if (cajaAbierta.length > 0) {

            return res.send(
                "Ya existe una caja abierta"
            );

        }

        const usuarioId = req.user!.id;

        await pool.query(`
            INSERT INTO caja (
                usuario_apertura_id,
                monto_inicial
            )
            VALUES (?, ?)
        `, [
            usuarioId,
            monto_inicial
        ]);

        res.redirect("/admin/caja");

    } catch (error) {

        console.log(error);

        res.status(500).send(
            "Error abrir caja"
        );

    }

};

// ===============================
// AGREGAR MOVIMIENTO
// ===============================
export const agregarMovimiento = async (
    req: AuthRequest,
    res: Response
) => {

    try {

        const {
            tipo,
            descripcion,
            monto
        } = req.body;

        // caja abierta
        const [cajas]: any = await pool.query(`
            SELECT *
            FROM caja
            WHERE estado = 'ABIERTA'
            LIMIT 1
        `);

        const caja = cajas[0];

        if (!caja) {

            return res.send(
                "No hay caja abierta"
            );

        }

        const usuarioId = req.user!.id;

        await pool.query(`
            INSERT INTO movimientos_caja (
                caja_id,
                tipo,
                descripcion,
                monto,
                usuario_id
            )
            VALUES (?, ?, ?, ?, ?)
        `, [
            caja.id,
            tipo,
            descripcion,
            monto,
            usuarioId
        ]);

        res.redirect("/admin/caja");

    } catch (error) {

        console.log(error);

        res.status(500).send(
            "Error movimiento"
        );

    }

};

// ===============================
// CERRAR CAJA
// ===============================
export const cerrarCaja = async (
    req: AuthRequest,
    res: Response
) => {

    try {

        const {
            monto_final
        } = req.body;

        const [cajas]: any = await pool.query(`
            SELECT *
            FROM caja
            WHERE estado = 'ABIERTA'
            LIMIT 1
        `);

        const caja = cajas[0];

        if (!caja) {

            return res.send(
                "No existe caja abierta"
            );

        }

        // ingresos
        const [ingresos]: any = await pool.query(`
            SELECT
                COALESCE(SUM(monto), 0) as total
            FROM movimientos_caja
            WHERE caja_id = ?
            AND tipo = 'INGRESO'
        `, [caja.id]);

        // egresos
        const [egresos]: any = await pool.query(`
            SELECT
                COALESCE(SUM(monto), 0) as total
            FROM movimientos_caja
            WHERE caja_id = ?
            AND tipo = 'EGRESO'
        `, [caja.id]);

        const esperado =
            Number(caja.monto_inicial)
            + Number(caja.ventas_efectivo)
            + Number(ingresos[0].total)
            - Number(egresos[0].total);

        const diferencia =
            Number(monto_final)
            - esperado;

        const usuarioId = req.user!.id;

        await pool.query(`
            UPDATE caja
            SET
                estado = 'CERRADA',
                fecha_cierre = NOW(),
                monto_final = ?,
                diferencia = ?,
                usuario_cierre_id = ?
            WHERE id = ?
        `, [
            monto_final,
            diferencia,
            usuarioId,
            caja.id
        ]);

        res.redirect("/admin/caja");

    } catch (error) {

        console.log(error);

        res.status(500).send(
            "Error cerrar caja"
        );

    }

};