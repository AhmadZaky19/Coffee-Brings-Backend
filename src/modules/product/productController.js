const redis = require("../../config/redis");
const { v4: uuidv4 } = require("uuid");
const productModel = require("./productModel");
const helperWrapper = require("../../helpers/wrapper");
const deleteFile = require("../../helpers/deleteFile");

module.exports = {
  getAllProduct: async (req, res) => {
    try {
      let { category, search, sort, order, page, limit } = req.query;
      page = Number(page) || 1;
      limit = Number(limit) || 3;
      category = category || "";
      search = search || "";
      sort = sort || "name";
      order = order || "asc";
      const offset = page * limit - limit;
      const totalData = await productModel.getCountProduct(category, search);
      const totalPage = Math.ceil(totalData / limit);
      if (page > totalPage) {
        return helperWrapper.response(res, 400, "Page not found", null);
      }
      const pageInfo = {
        page,
        totalPage,
        limit,
        totalData,
      };
      const result = await productModel.getAllProduct(
        category,
        search,
        sort,
        order,
        limit,
        offset
      );
      const newResult = result.map((item) => {
        const data = {
          ...item,
          size: item.size.split(","),
        };
        return data;
      });
      if (newResult.length < 1) {
        return helperWrapper.response(res, 404, "Data not found", null);
      }

      redis.setex(
        `getProduct:${JSON.stringify(req.query)}`,
        3600,
        JSON.stringify({ newResult, pageInfo })
      );

      return helperWrapper.response(
        res,
        200,
        "Success get product data",
        newResult,
        pageInfo
      );
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message})`,
        null
      );
    }
  },
  getProductById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await productModel.getProductById(id);
      if (result.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Product by id ${id} not found !`,
          null
        );
      }

      redis.setex(`getProduct:${id}`, 3600, JSON.stringify(result));

      return helperWrapper.response(
        res,
        200,
        "Success get product by id",
        result
      );
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message})`,
        null
      );
    }
  },
  postMovie: async (req, res) => {
    try {
      const { name, size, price, description, category } = req.body;
      const setData = {
        id: uuidv4(),
        name,
        image: req.file ? req.file.filename : null,
        size,
        price,
        description,
        category,
      };
      const result = await productModel.postProduct(setData);
      return helperWrapper.response(res, 200, "Success post product", result);
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message})`,
        null
      );
    }
  },
};
