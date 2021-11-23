const express = require("express");

const Router = express.Router();
const userRoutes = require("../modules/user/userRoutes");
const productRoutes = require("../modules/product/productRoutes");

Router.use("/user", userRoutes);
Router.use("/product", productRoutes);

module.exports = Router;
