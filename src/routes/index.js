const express = require("express");
const Router = express.Router();

const userRoutes = require("../modules/user/userRoutes");
const authRoutes = require("../modules/auth/authRoutes");
const promoRouter = require("../modules/promo/promoRoutes");
const productRoutes = require("../modules/product/productRoutes");
const orderRoutes = require("../modules/order/orderRoutes");

Router.use("/auth", authRoutes);
Router.use("/user", userRoutes);
Router.use("/promo", promoRouter);
Router.use("/product", productRoutes);
Router.use("/auth", authRoutes);
Router.use("/order", orderRoutes);

module.exports = Router;
