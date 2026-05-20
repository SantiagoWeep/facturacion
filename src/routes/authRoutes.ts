import { Router } from "express";

import { login } from "../controllers/authController";

const router = Router();

router.post("/login", login);

router.get("/login", (req, res) => {
    res.render("auth/login");
});

router.get("/logout", (req, res) => {

    res.clearCookie("token");

    return res.redirect("/");

});

export default router;