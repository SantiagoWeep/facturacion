import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
    id: number;
    rol: string;
}

export interface AuthRequest extends Request {
    user?: JwtPayload;
}

export const verifyToken = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {

    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({
            message: "No autorizado"
        });
    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as JwtPayload;

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            message: "Token inválido"
        });

    }
};