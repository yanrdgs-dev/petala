const express = require("express");
const bodyParser = require("body-parser");
const agendaRoutes = require("./routes/agendaRoutes");
const userRoutes = require("./routes/userRoutes");
const loginRoutes = require("./routes/loginRoutes");
const configRoutes = require("./routes/configRoutes");
const checklistRoutes = require("./routes/checklistRoutes");
const db = require("./config/db");
const cors = require("cors");
const emailRoutes = require("./routes/mailRoutes")
const verifyEmail = require("./routes/verifyEmailRoutes")
const focusMode = require('./routes/focusRoutes');

const app = express();

app.use(cors());

// Config para que o express entenda JSON no corpo da requisição
app.use(express.json());

// Requisição do html

// Roteamento
app.use("/api/users", userRoutes);
app.use("/login", loginRoutes);
app.use("/profile_picture", configRoutes);
app.use("/api/checklists", checklistRoutes);
// app.use("/api/dashboard", dashboardRoutes);
app.use("/api/agenda", agendaRoutes);
app.use('/send-email', emailRoutes)
app.use('/verify-email', verifyEmail )
app.use('/focus', focusMode)

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
