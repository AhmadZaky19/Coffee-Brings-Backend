const helperWrapper = require("../../helpers/wrapper");
const authModel = require("./authModel");
const { v4: uuidv4 } = require("uuid");
const bcryptjs = require("bcrypt");
// const redis = require("../../config/redis");

module.exports = {
  register: async (req, res) => {
    try {
      const { email, password, phoneNumber, role } = req.body;
      if (password.length < 6) {
        return helperWrapper.response(res, 400, "Password must be more than 6");
      }
      // PROSES ENCRYPT PASSWORD
      const hashPassword = await bcryptjs.hash(password, 10);
      const setData = {
        id: uuidv4(),
        email,
        phoneNumber,
        password: hashPassword,
        role: role || "user",
      };
      const checkUser = await authModel.getUserByEmail(email);
      if (checkUser.length > 0) {
        return helperWrapper.response(res, 409, "Email already used", null);
      }
      const checkPassword = bcryptjs.compare(password, email[0].password);


      const result = await authModel.register(setData);
      return helperWrapper.response(res, 200, "Success register user", result);
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad Request, ${error.message}`, null);
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const checkUser = await authModel.checkUser(email);
      if (checkUser.length < 1) {
        return helperWrapper.response(
          res,
          404,
          "Can't find an account using that E-Mail"
        );
      }

      const status = checkUser[0].userStatus;

      if (status !== "Active") {
        return helperWrapper.response(
          res,
          404,
          "Please Activate Your Account First"
        );
      }

      if ((await bcrypt.compare(password, checkUser[0].password)) === false) {
        return helperWrapper.response(res, 400, "Wrong Password");
      }

      const payload = checkUser[0];
      delete payload.password;

      const token = jwt.sign({ ...payload }, process.env.jwtKey, {
        expiresIn: "24h",
      });

      return helperWrapper.response(res, 200, `Login Success`, {
        id: payload.id,
        token,
      });
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad Request ${error.message}`
      );
    }
  },
};