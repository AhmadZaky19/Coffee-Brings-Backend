const helperWrapper = require("../../helpers/wrapper");

module.exports = {
  hello: async (req, res) => {
    try {
      return helperWrapper.response(res, 200, "Hello", null);
    } catch (err) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${err.message})`,
        null
      );
    }
  },
};
