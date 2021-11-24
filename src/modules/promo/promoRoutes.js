const express = require("express");
const Router = express.Router();
// const middlewareAuth = require("../../middleware/auth");
const middlewareUpload = require("../../middleware/uploadPromo");
const middlewareRedis = require("../../middleware/redis");
//========================================================
const promoController = require("./promoController");

Router.post(
  "/",
  // middlewareAuth.isAdmin,
  middlewareUpload,
  middlewareRedis.clearPromoRedis,
  promoController.postPromo
);

Router.get(
  "/",
  // middlewareAuth.isAdmin,
  middlewareRedis.getPromoRedis,
  promoController.getAllPromo
);

Router.get(
  "/:id",
  // middlewareAuth.isAdmin,
  middlewareRedis.getPromoByIdRedis,
  promoController.getPromoById
);

Router.patch(
  "/:id",
  // middlewareAuth.isAdmin,
  middlewareUpload,
  middlewareRedis.clearPromoRedis,
  promoController.updatePromo
);

Router.delete(
  "/:id",
  // middlewareAuth.isAdmin,
  promoController.deletePromo
);

module.exports = Router;
