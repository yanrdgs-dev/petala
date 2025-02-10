const express = require("express");
const bodyParser = require("body-parser");
const agendaRoutes = require("./routes/agendaRoutes");
const userRoutes = require("./routes/userRoutes");
const loginRoutes = require("./routes/loginRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const checklistRoutes = require("./routes/checklistRoutes");
const db = require("./config/db");
const cors = require("cors");
const emailRoutes = require("./routes/mailRoutes")
const verifyEmail = require("./routes/verifyEmailRoutes")
const path = require("path");
const passwordResetRoutes = require("./routes/passwordResetRoutes");
const redirectPassword = require("./routes/redirectPassswordRotues")
// const nova_Senha =  require("./routes/nova_senha.Routes")
const focusMode = require("./routes/focusRoutes")
const app = express();



app.use(cors());
app.use(express.json());


app.use("/api/users", userRoutes);
app.use("/login", loginRoutes);
app.use("/api/checklists", checklistRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/agenda", agendaRoutes);
app.use('/send-email', emailRoutes)
app.use('/verify-email', verifyEmail )
app.use("/password-reset", passwordResetRoutes);
// app.use("/nova_senha", nova_Senha)
app.use('/focus', focusMode)
app.use('/', redirectPassword)



db.connect((err) => {
  if (err) {
    console.error("Falha na conexão com o banco de dados.");
    process.exit(1);
  }
  console.log("Banco de dados conectado com sucesso.");
});

// Exportar o app
module.exports = app;
