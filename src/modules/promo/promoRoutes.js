const express = require("express");
const Router = express.Router();
// const middlewareAuth = require("../../middleware/auth");
const middlewareUpload = require("../../middleware/uploadPromo");
//========================================================
const promoController = require("./promoController");

Router.post(
  "/",
  // middlewareAuth.isAdmin,
  middlewareUpload,
  promoController.postPromo
);
Router.get(
  "/",
  // middlewareAuth.isAdmin,
  promoController.getAllPromo
);
Router.get("/:id", promoController.getPromoById);
Router.patch(
  "/:id",
  // middlewareAuth.isAdmin,
  middlewareUpload,
  promoController.updatePromo
);
Router.delete(
  "/:id", // middlewareAuth.isAdmin,
  promoController.deletePromo
);

module.exports = Router;
