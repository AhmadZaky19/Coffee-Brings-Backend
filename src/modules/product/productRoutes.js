const express = require("express");

const Router = express.Router();

const productController = require("./productController");
// const middlewareAuth = require("../../middleware/auth");
const middlewareRedis = require("../../middleware/redis");
const middlewareUpload = require("../../middleware/uploadProduct");

Router.get(
  "/",
  middlewareRedis.getProductRedis,
  productController.getAllProduct
);
Router.get(
  "/:id",
  middlewareRedis.getProductByIdRedis,
  productController.getProductById
);
Router.post(
  "/",
  middlewareRedis.clearProductRedis,
  middlewareUpload,
  productController.postProduct
);
Router.patch(
  "/:id",
  middlewareRedis.clearProductRedis,
  middlewareUpload,
  productController.updateProduct
);
Router.delete(
  "/:id",
  productController.deleteProduct,
  middlewareRedis.clearProductRedis
);

module.exports = Router;
