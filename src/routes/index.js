const express = require("express");

const Router = express.Router();
const userRoutes = require("../modules/user/userRoutes");
const authRoutes = require("../modules/auth/authRoutes")
const orderRoutes = require("../modules/order/orderRoutes")

Router.use("/user", userRoutes);
Router.use("/auth", authRoutes)
Router.use("/order", orderRoutes)


module.exports = Router;
