const express = require("express");
const userRoutes = require("./routes/userRoutes");
const loginRoutes = require("./routes/loginRoutes")
const db = require("./config/db");
const cors = require("cors");


const app = express();

app.use(cors());

// Config para que o express entenda JSON no corpo da requisição
app.use(express.json());

// Requisição do html

// Roteamento
app.use("/api/users", userRoutes);
app.use("/login", loginRoutes );

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
