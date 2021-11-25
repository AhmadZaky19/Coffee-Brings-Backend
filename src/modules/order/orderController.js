const { v4: uuid } = require("uuid")
const helperWrapper = require("../../helpers/wrapper")
const orderModel = require("./orderModel")

module.exports = {
  postOrder: async (req, res) => {
    try {
      const { body } = req
      const setData = { id: uuid(), ...body }
      const result = await orderModel.postOrder(setData)
      return helperWrapper.response(res, 200, "Success Create Data", result)
    }
    catch (error) {
      return helperWrapper.response(res, 400, `Bad Request(${error.message})`, null)
    }
  },
  getOrderByUserId: async (req, res) => {
    try {
      const { idUser } = req.params
      const result = await orderModel.getOrderByUserId(idUser)
      if (result.length < 1) {
        return helperWrapper.response(
          res, 404, `User Id ${idUser} Not Found!`, null)
      }
      return helperWrapper.response(
        res, 200, 'Success Get By User Id', result)
    } catch (error) {
      return helperWrapper.response(
        res, 400, `Bad Request (${error.message})`, null)
    }
  },
  getOrderId: async (req, res) => {
    try {
      const { id } = req.params
      const result = await orderModel.getOrderId(id)
      if (result.length < 1) {
        return helperWrapper.response(
          res, 404, ` Id ${id} Not Found!`, null)
      }
      return helperWrapper.response(
        res, 200, 'Success Get By User Id', result)
    } catch (error) {
      return helperWrapper.response(
        res, 400, `Bad Request (${error.message})`, null)
    }
  },
  deleteOrder: async (req, res) => {
    try {
      const { id } = req.params;
      const checkId = await orderModel.getOrderId(id);
      if (checkId.length < 1) {
        return helperWrapper.response(
          res, 404, `Data by id ${id} not found !`, null)
      }
      const result = await orderModel.deleteOrder(id);
      return helperWrapper.response(res, 200, 'Success delete data', req.param);
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message})`,
        null
      );
    }
  },
}