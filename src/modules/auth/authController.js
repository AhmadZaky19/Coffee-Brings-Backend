require("dotenv").config();
const authModel = require("./authModel");
const helperWrapper = require("../../helpers/wrapper");
const sendMail = require("../../helpers/mail");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const generateKey = () => {
  const res = Math.floor(100000 + Math.random() * 900000);
  return res;
};

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
        `Bad Request, ${error.message}`,
        null
      );
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
      return helperWrapper.response(res, 400, `Bad Request ${error.message}`);
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { email, linkRedirect } = req.body;
      const keysChangePassword = generateKey();

      // CHECK USER BY EMAIL

      // ======

      await authModel.updateDataUser(
        { keysChangePassword, updatedAt: new Date() },
        // checkUser[0].id
        123
      );

      const setSendEmail = {
        to: email,
        subject: `Reset Password !`,
        template: "forgot-password",
        data: {
          // name: checkUser[0].firstName,
          firstName: "walid",
          // id: result.id,
          buttonUrl: `${linkRedirect}/${keysChangePassword}`,
        },
      };

      await sendMail(setSendEmail);

      return helperWrapper.response(
        res,
        200,
        "Process success, please check your email !",
        email
      );
    } catch (err) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${err.message})`,
        null
      );
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { id, keysChangePassword, newPassword, confirmPassword } = req.body;

      // const checkUser = await authModel.getDataConditions({ keysChangePassword });
      // if (checkUser.length < 1) {
      //   return helper.response(
      //     res,
      //     400,
      //     'Your keys is not valid, please repeat step forgot password',
      //     null
      //   );
      // }

      // const { id, minuteDiff } = checkUser[0];
      // if (minuteDiff < -5) {
      //   await authModel.updateDataUser({ keysChangePassword: null, updatedAt: new Date() }, id);
      //   return helper.response(
      //     res,
      //     400,
      //     'Your keys is expired, please repeat step forgot password',
      //     null
      //   );
      // }

      if (newPassword !== confirmPassword) {
        return helperWrapper.response(res, 400, "Password not same", null);
      }

      const salt = bcrypt.genSaltSync(10);
      const encryptPassword = bcrypt.hashSync(newPassword, salt);

      await authModel.updateDataUser(
        {
          keysChangePassword: null,
          password: encryptPassword,
          updatedAt: new Date(),
        },
        id
      );

      return helperWrapper.response(res, 200, "Success change password", {
        id,
      });
    } catch (err) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${err.message})`,
        null
      );
    }
  },

  logout: async (req, res) => {
    try {
      let token = req.headers.authorization;
      token = token.split(" ")[1];

      redis.setex(`accessToken:${token}`, 3600 * 24, token);

      return helperWrapper.response(res, 200, "Success logout", null);
    } catch (err) {
      return helperWrapper.response(
        res,
        400,
        `Bad Request (${err.message})`,
        null
      );
    }
  },
};
