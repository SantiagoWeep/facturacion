import { Request, Response } from "express";
import pool from "../config/db";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (
    req: Request,
    res: Response
) => {

    try {

        const { usuario, password } = req.body;

        const [rows]: any = await pool.query(
            "SELECT * FROM usuarios WHERE usuario = ?",
            [usuario]
        );

        const user = rows[0];

        if (!user) {

            return res.status(400).json({
                message: "Usuario incorrecto"
            });

        }

        const validPassword = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!validPassword) {

            return res.status(400).json({
                message: "Contraseña incorrecta"
            });

        }

        const token = jwt.sign(
            {
                id: user.id,
                rol: user.rol
            },
            process.env.JWT_SECRET as string,
            {
                expiresIn: "8h"
            }
        );

        res.cookie("token", token, {
            httpOnly: true
        });

        return res.json({
            message: "Login correcto"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Error servidor"
        });

    }
};