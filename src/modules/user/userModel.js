const connection = require("../../config/mysql");

module.exports = {
  getUserById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM user WHERE id = ?",
        id,
        (error, results) => {
          if (!error) {
            const newResults = results;
            // delete newResults[0].password;
            resolve(newResults);
          } else {
            reject(new Error(`Message ${error.message}`));
          }
        }
      );
    }),

  updateProfile: (data, id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE user SET ? WHERE id = ?",
        [data, id],
        (error, results) => {
          if (!error) {
            const newResult = {
              id,
              ...data,
            };
            resolve(newResult);
          } else {
            reject(new Error(`Message ${error.message}`));
          }
        }
      );
    }),
};
