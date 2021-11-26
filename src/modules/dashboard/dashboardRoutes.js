const express = require("express");
const Router = express.Router();

const dashboardController = require("./dashboardController");

Router.get("/", dashboardController.getDashboard);

module.exports = Router;
