const express = require("express");
const userRoutes = require("./routes/userRoutes");
const loginRoutes = require("./routes/loginRoutes")
const logoutRoutes = require('./routes/logoutRoutes');
const db = require("./config/db");
const cors = require("cors");
const session = require("express-session");


const app = express();

app.use(session({
  secret:"petalaroot", //! Lembrar depois para trocar pelo arquvio .ENV ou apenas armazenar lá!
  resave:false,
  saveUninitialized:true,
  cookie:{secure:false}

}))

app.use(cors());

// Config para que o express entenda JSON no corpo da requisição
app.use(express.json());

// Requisição do html

// Roteamento
app.use("/api/users", userRoutes);
app.use("/login", loginRoutes );
app.use("/logout", logoutRoutes )
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
