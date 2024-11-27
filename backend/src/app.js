const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const db = require("./config/db");

const app = express();

// Config para que o express entenda JSON no corpo da requisição
app.use(bodyParser.json());

// Roteamento
app.use("/api/users", userRoutes);

db.connect((err) => {
  if (err) {
    console.error("Falha na conexão com o banco de dados.");
    process.exit(1);
  }
  console.log("Banco de dados conectado com sucesso.");
});

// Inicializa o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
