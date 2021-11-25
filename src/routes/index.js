const express = require("express");
const Router = express.Router();

const promoRouter = require("../modules/promo/promoRoutes");
const authRouter = require("../modules/auth/authRoutes");
const userRouter = require("../modules/user/userRoutes");

// Router.use("/user", usersRouter);
Router.use("/promo", promoRouter);
Router.use("/auth", authRouter);
Router.use("/user", userRouter);

module.exports = Router;
