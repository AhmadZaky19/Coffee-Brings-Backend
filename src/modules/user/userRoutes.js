const express = require("express");

const Router = express.Router();

// const middlewareAuth = require("../../middleware/auth");
const userController = require("./userController");

Router.get("/", userController.hello);

module.exports = Router;
