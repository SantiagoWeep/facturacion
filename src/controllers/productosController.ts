import { Request, Response } from "express";
import pool from "../config/db";

export const getProductos = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query(`
            SELECT * FROM productos 
            WHERE activo = 1 
            ORDER BY categoria, nombre
        `);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error obteniendo productos" });
    }
};

export const listarProductosView = async (req: Request, res: Response) => {
    try {
        const [productos] = await pool.query(`
            SELECT * FROM productos 
            WHERE activo = 1 
            ORDER BY categoria, nombre
        `);
        
        res.render("admin/productos", { productos });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al cargar productos");
    }
};

export const crearProducto = async (req: Request, res: Response) => {
    try {
        const { nombre, precio, codigo_barras, categoria } = req.body;

        await pool.query(
            `INSERT INTO productos (nombre, precio, codigo_barras, categoria, activo) 
             VALUES (?, ?, ?, ?, 1)`,
            [nombre, precio, codigo_barras || null, categoria || 'Sin categoría']
        );

        res.redirect("/admin/productos");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al crear producto");
    }
};

export const eliminarProducto = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await pool.query("UPDATE productos SET activo = 0 WHERE id = ?", [id]);
        res.redirect("/admin/productos");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al eliminar producto");
    }
};