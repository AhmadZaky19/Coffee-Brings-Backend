const connection = require("../../config/mysql");

module.exports = {
  getDashboard: (data) =>
    new Promise((resolve, reject) => {
      connection.query(
        data === "dialy"
          ? "SELECT DAYNAME(createdAt) AS day, SUM(total) AS total from `order` WHERE YEARWEEK(createdAt) = YEARWEEK(NOW()) GROUP BY DATE(createdAt)"
          : data === "weekly"
          ? "SELECT MONTHNAME(createdAt) AS month, SUM(total) AS total from `order` WHERE YEAR(createdAt) = YEAR(NOW()) GROUP BY MONTH(createdAt)"
          : "SELECT MONTHNAME(createdAt) AS month, SUM(total) AS total from `order` WHERE YEAR(createdAt) = YEAR(NOW()) GROUP BY MONTH(createdAt)",
        (err, result) => {
          if (!err) {
            resolve(result);
          } else {
            reject(new Error(`SQL: ${err.sqlMessage}`));
          }
        }
      );
    }),
};
