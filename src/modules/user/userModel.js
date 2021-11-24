const connection = require('../../config/mysql')

module.exports = {
  register: (data) =>
    new Promise((resolve, reject) => {
      connection.query('INSERT INTO users SET?', data, (error, result) => {
        if (!error) {
          const newResult = {
            id: result.insertId,
            ...data
          }
          delete newResult.password
          resolve(newResult)
        } else {
          reject(new Error(`SQL:${error.sqlMessage}`))
        }
      })
    }),
}