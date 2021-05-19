const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "axboxonewe15",
  database: "peliculas",
});

module.exports = connection;
