const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const loginRoutes = require("./routes/loginRoutes");

// const dashboardRoutes = require("./routes/dashboardRoutes");
const checklistRoutes = require("./routes/checklistRoutes");
const db = require("./config/db");
const cors = require("cors");
const emailRoutes = require("./routes/mailRoutes")
const verifyEmail = require("./routes/verifyEmailRoutes")
const path = require("path");
const passwordResetRoutes = require("./routes/passwordResetRoutes");
// const nova_Senha =  require("./routes/nova_senha.Routes")
const app = express();



app.use(cors());
app.use(express.json());
// app.use(express.static(path.join(__dirname, 'frontend', 'public')));
// console.log('Pasta de arquivos estáticos:', path.join(__dirname, 'frontend', 'public'));

// Requisição do html

// Roteamento
app.use("/api/users", userRoutes);
app.use("/login", loginRoutes);
app.use("/api/checklists", checklistRoutes);
// app.use("/api/dashboard", dashboardRoutes);
app.use('/send-email', emailRoutes)
app.use('/verify-email', verifyEmail )
app.use("/password-reset", passwordResetRoutes);
// app.use("/nova_senha", nova_Senha)



db.connect((err) => {
  if (err) {
    console.error("Falha na conexão com o banco de dados.");
    process.exit(1);
  }
  console.log("Banco de dados conectado com sucesso.");
});

// Exportar o app
module.exports = app;
