const connection = require("../../config/mysql");

module.exports = {
  register: (data) =>
    new Promise((resolve, reject) => {
      connection.query("INSERT INTO user SET?", data, (error, result) => {
        if (!error) {
          const newResult = {
            id: result.insertId,
            ...data,
          };
          delete newResult.password;
          resolve(newResult);
        } else {
          reject(new Error(`SQL:${error.sqlMessage}`));
        }
      });
    }),
  verifyUser: (data, id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE user SET status = ? WHERE id = ?",
        [data, id],
        (err, result) => {
          if (!err) {
            resolve(result);
          } else {
            reject(new Error(`SQL : ${err.sqlMessage}`));
          }
        }
      );
    }),
  getUserByEmail: (email) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM user WHERE email = ?",
        email,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(`SQL: ${error.sqlMessage}`));
          }
        }
      );
    }),
  // login: async (req, res) => {
  //   try {
  //     const { email, password } = req.body;
  //     const checkUser = await authModel.getUserByEmail(email);
  //     if (checkUser.length < 1) {
  //       return helperWrapper.response(
  //         res,
  //         404,
  //         "Email is not registered",
  //         null
  //       );
  //     }

  //     const matchPassword = await bcrypt.compare(
  //       password,
  //       checkUser[0].password
  //     );
  //     if (!matchPassword) {
  //       return helperWrapper.response(res, 400, "Wrong email/password", null);
  //     }

  //     if (checkUser[0].status !== "active") {
  //       return helperWrapper.response(
  //         res,
  //         400,
  //         `Please verify email first`,
  //         null
  //       );
  //     }
  //     const payload = checkUser[0];
  //     delete payload.password;
  //     const token = jwt.sign({ ...payload }, process.env.SECRET_KEY, {
  //       expiresIn: "3h",
  //     });
  //     return helperWrapper.response(res, 200, "Success login", {
  //       id: payload.id,
  //       token,
  //       refreshToken,
  //     });
  //   } catch (error) {
  //     return helperWrapper.response(
  //       res,
  //       400,
  //       `Bad request (${error.message})`,
  //       null
  //     );
  //   }
  // },
};
