const express = require("express");
const Router = express.Router();
const middlewareAuth = require("../../middleware/auth");
const authController = require("./authController")

Router.post('/register', authController.register)
// Router.post('/login', authController.login)
module.exports = Router