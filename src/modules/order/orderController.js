const { v4: uuid } = require("uuid");
const helperWrapper = require("../../helpers/wrapper");
const orderModel = require("./orderModel");

module.exports = {
  postOrder: async (req, res) => {
    try {
      const {
        idUser,
        idPromo,
        subTotal,
        tax,
        total,
        paymentMethod,
        paymentStatus,
        orderItem,
      } = req.body;

      const setData = {
        id: uuid(),
        idUser,
        idPromo,
        invoice: "CB-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        subTotal,
        tax,
        total,
        paymentMethod,
        paymentStatus,
      };

      // POST ORDER
      await orderModel.postOrder(setData);

      const setData2 = {
        id: uuid(),
        orderId: setData.id,
      };

      // POST ORDER ITEM
      orderItem.map(async (item) => {
        await orderModel.postOrderItem({
          ...setData2,
          productId: item.productId,
          qty: item.qty,
          total: item.total,
        });
      });

      const result = {
        ...setData,
        orderItem,
      };

      return helperWrapper.response(res, 200, "Success Create Data", result);
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad Request(${error.message})`,
        null
      );
    }
  },

  getOrderByUserId: async (req, res) => {
    try {
      const { idUser } = req.params;
      const result = await orderModel.getOrderByUserId(idUser);
      if (result.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `User Id ${idUser} Not Found!`,
          null
        );
      }
      return helperWrapper.response(res, 200, "Success Get By User Id", result);
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad Request (${error.message})`,
        null
      );
    }
  },

  deleteOrder: async (req, res) => {
    try {
      const { id } = req.params;
      const checkId = await orderModel.getOrderByUserId(id);
      if (checkId.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by id ${id} not found !`,
          null
        );
      }
      const result = await orderModel.deleteOrder(id);
      return helperWrapper.response(res, 200, "Success delete data", result);
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
