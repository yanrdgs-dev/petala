const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const db = require("./config/db");
const cors = require("cors");

const app = express();

app.use(cors());

// Config para que o express entenda JSON no corpo da requisição
app.use(bodyParser.json());

// Requisição do html

// Roteamento
app.use("/api/users", userRoutes);

// Conectar com o banco de dados
db.connect((err) => {
  if (err) {
    console.error("Falha na conexão com o banco de dados.");
    process.exit(1);
  }
  console.log("Banco de dados conectado com sucesso.");
});

// Exportar o app
module.exports = app;
