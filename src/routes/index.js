const express = require("express");
const Router = express.Router();
const usersRouter = require("../modules/user/userRoutes");
const promoRouter = require("../modules/promo/promoRoutes");

Router.use("/user", usersRouter);
Router.use("/promo", promoRouter);

module.exports = Router;
