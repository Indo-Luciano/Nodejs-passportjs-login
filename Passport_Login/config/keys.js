const mysql = require("mysql2");

const conDB = mysql.createConnection({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: `passport_login`,
});

module.exports = conDB;
