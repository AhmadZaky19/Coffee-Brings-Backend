const express = require("express");

const Router = express.Router();

const productController = require("./productController");
const middlewareAuth = require("../../middleware/auth");
const middlewareRedis = require("../../middleware/redis");
const middlewareUpload = require("../../middleware/uploadProduct");

Router.get(
  "/",
  middlewareAuth.authentication,
  middlewareRedis.getProductRedis,
  productController.getAllProduct
);
Router.get(
  "/:id",
  middlewareAuth.authentication,
  middlewareRedis.getProductByIdRedis,
  productController.getProductById
);
Router.post(
  "/",
  middlewareAuth.authentication,
  middlewareAuth.isAdmin,
  middlewareRedis.clearProductRedis,
  middlewareUpload,
  productController.postProduct
);
Router.patch(
  "/:id",
  middlewareAuth.authentication,
  middlewareAuth.isAdmin,
  middlewareRedis.clearProductRedis,
  middlewareUpload,
  productController.updateProduct
);
Router.delete(
  "/:id",
  middlewareAuth.authentication,
  middlewareAuth.isAdmin,
  productController.deleteProduct,
  middlewareRedis.clearProductRedis
);

module.exports = Router;
