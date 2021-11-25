const helperWrapper = require("../../helpers/wrapper");
const authModel = require("./authModel");
const { v4: uuidv4 } = require("uuid");
const bcryptjs = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMail = require("../../helpers/email");

module.exports = {
  register: async (req, res) => {
    try {
      const { email, password, phoneNumber } = req.body;
      const checkUser = await authModel.getUserByEmail(email);
      if (checkUser.length > 0) {
        return helperWrapper.response(res, 409, "Email already used", null);
      }
      if (password.length < 6) {
        return helperWrapper.response(
          res,
          400,
          "Password must be more than 6 character"
        );
      }
      // PROSES ENCRYPT PASSWORD
      const hashPassword = await bcryptjs.hash(password, 10);
      const setData = {
        id: uuidv4(),
        email,
        password: hashPassword,
        phoneNumber,
        role: "user",
      };
      // const checkPassword = bcryptjs.compare(password, email[0].password);
      const result = await authModel.register(setData);

      const setDataMail = {
        to: result.email,
        subject: "Email Verification",
        template: "email-verification",
        data: {
          id: result.id,
          email: result.email,
        },
      };

      await sendMail(setDataMail);
      return helperWrapper.response(
        res,
        200,
        "Success register user, please verify your email",
        result
      );
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad Request, ${error.message}`,
        null
      );
    }
  },
  verifyUser: async (req, res) => {
    try {
      const { id } = req.params;

      await authModel.verifyUser("active", id);
      return helperWrapper.response(res, 200, "Email verification success");
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad Request (${error.message})`,
        null
      );
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const checkUser = await authModel.getUserByEmail(email);
      if (checkUser.length < 1) {
        return helperWrapper.response(
          res,
          404,
          "Email is not registered",
          null
        );
      }

      if (checkUser[0].status !== "active") {
        return helperWrapper.response(
          res,
          400,
          `Please verify email first`,
          null
        );
      }

      const matchPassword = await bcryptjs.compare(
        password,
        checkUser[0].password
      );
      if (!matchPassword) {
        return helperWrapper.response(res, 400, "Wrong password", null);
      }
      const payload = checkUser[0];
      delete payload.password;
      const token = jwt.sign({ ...payload }, process.env.SECRET_KEY, {
        expiresIn: "3h",
      });
      return helperWrapper.response(res, 200, "Success login", {
        id: payload.id,
        token,
      });
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
