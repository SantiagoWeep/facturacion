import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import pool from "./config/db";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";
import ventasRoutes from "./routes/ventasRoutes";
import productosRoutes from "./routes/productosRoutes";
import apiVentasRoutes from "./routes/apiVentasRoutes";

dotenv.config();

const app = express();

async function testDB() {
    try {

        const connection = await pool.getConnection();

        console.log("MySQL conectado");

        connection.release();

    } catch (error) {

        console.log("Error MySQL:", error);

    }
}

testDB();

app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({
  extended: true
}));

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/ventas", ventasRoutes);
app.use("/admin/productos", productosRoutes);
app.use("/api/ventas", apiVentasRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("POS funcionando");
});

const PORT = process.env.PORT || 3434;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(process.env.PRINTER_NAME);
  
});