require("dotenv").config();
const authModel = require("./authModel");
const helperWrapper = require("../../helpers/wrapper");
const sendMail = require("../../helpers/mail");
const bcrypt = require("bcrypt");

const generateKey = () => {
  const res = Math.floor(100000 + Math.random() * 900000);
  return res;
};

module.exports = {
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
