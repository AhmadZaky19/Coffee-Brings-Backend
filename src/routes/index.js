const express = require("express");
const Router = express.Router();

const userRoutes = require("../modules/user/userRoutes");
const authRoutes = require("../modules/auth/authRoutes");
const promoRouter = require("../modules/promo/promoRoutes");

Router.use("/auth", authRoutes);
Router.use("/user", userRoutes);
Router.use("/promo", promoRouter);

module.exports = Router;
