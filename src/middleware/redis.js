const redis = require("../config/redis");
const helperWrapper = require("../helpers/wrapper");

module.exports = {
  getProductRedis: (req, res, next) => {
    redis.get(`getProduct:${JSON.stringify(req.query)}`, (error, result) => {
      if (!error && result !== null) {
        // eslint-disable-next-line no-console
        console.log("Data is in redis");
        const newResult = JSON.parse(result);
        return helperWrapper.response(
          res,
          200,
          "Success get data product",
          newResult.result,
          newResult.pageInfo
        );
      }
      // eslint-disable-next-line no-console
      console.log("No data in redis");
      next();
    });
  },
  getProductByIdRedis: (req, res, next) => {
    const { id } = req.params;
    redis.get(`getProduct:${id}`, (error, result) => {
      if (!error && result !== null) {
        // eslint-disable-next-line no-console
        console.log("Data is in redis");
        const newResult = JSON.parse(result);
        return helperWrapper.response(
          res,
          200,
          "Success get data product by id",
          newResult
        );
      }
      // eslint-disable-next-line no-console
      console.log("No data in redis");
      next();
    });
  },
  clearProductRedis: (req, res, next) => {
    redis.keys("getProduct:*", (error, result) => {
      if (result.length > 0) {
        result.forEach((item) => {
          redis.del(item);
        });
      }
      next();
    });
  },
};
