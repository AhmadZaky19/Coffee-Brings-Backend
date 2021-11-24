const express = require("express");

const Router = express.Router();
const userRoutes = require("../modules/user/userRoutes");
const authRoutes = require("../modules/auth/authRoutes");

Router.use("/user", userRoutes);
Router.use("/auth", authRoutes);

module.exports = Router;
