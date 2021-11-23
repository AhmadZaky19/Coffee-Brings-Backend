const express = require("express");

const Router = express.Router();

const authController = require("./authController");

Router.post("/forgot-password", authController.forgotPassword);
Router.patch("/reset-password", authController.resetPassword);
Router.post("/logout", authController.logout);

module.exports = Router;
