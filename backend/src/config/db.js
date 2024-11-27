const mysql = require("mysql2");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../..", ".env") });
// Conexão com o database
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados: " + err.stack);
    return;
  }
  console.log("Conectado ao banco de dados com o id " + connection.threadId);
});

module.exports = connection;
