const helperWrapper = require('../../helpers/wrapper');
const modelAuth = require("./authModel")
const { v4: uuidv4 } = require("uuid")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const redis = require('../../config/redis');
const authModel = require('./authModel');
const JWT_KEY = process.env

module.exports = {
  register: async (req, res) => {
    try {
      const { email, password, phoneNumber, role } = req.body
      let hashPassword = await bcrypt.hash(password, 10);
      let setData = {
        id: uuidv4(), email, role: role || "user", password: hashPassword, phoneNumber
      }
      const checkUser = await authModel.getUserByEmail(email);
      if (checkUser.length > 0) {
        return helperWrapper.response(res, 409, `Email already used`, null);
      }

      if (checkUser.length < 1) {
        return helperWrapper.response(res, 404, 'Account not registed');
      }

      if (checkUser[0].status === 0) {
        return helperWrapper.response(res, 400, 'Account not active');
      }

      const checkPassword = bcrypt.compareSync(password, email[0].password);
      if (!checkPassword) {
        return helperWrapper.response(res, 400, 'Wrong password');
      }
      if (checkPassword.length < 6) {
        return helperWrapper.response(res, 400, 'Password must be more than 6')
      }

      const result = await modelAuth.register(setData)
      return helperWrapper.response(res, 200, 'Success register user', result)

    } catch (error) {
      return helperWrapper.response(res, 400, `Bad Request ${error.message}, null`)
    }
  },
  // login: async (req, res) => {
  //   try {
  //     const { email, password } = req.body
  //     const checkUser = await modelAuth.getUserByEmail(email)
  //     console.log(checkUser)
  //     if (checkUser.length < 1) {
  //       return helperWrapper.response(res, 404, 'Email not registed')
  //     }
  //     if ((await bcrypt.compare(password, checkUser[0].password)) == false) {
  //       return helperWrapper.response(res, 400, "Wrong Password");
  //     }

  //     const payload = checkUser[0];
  //     delete payload.password;

  //     const token = jwt.sign({ ...payload }, `${JWT_KEY}`, {
  //       expiresIn: "24h",
  //     });
  //     return helperWrapper.response(res, 200, 'Success login', {
  //       id: payload.id,
  //       token,
  //     });
  //   } catch (error) {
  //     return helperWrapper.response(res, 400, `Bad Request ${error.message}, null`)
  //   }
  // },
}