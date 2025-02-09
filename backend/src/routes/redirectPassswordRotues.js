const express = require("express");
const router = express.Router();

router.get("/reset-page", (req, res) => {
  const token = req.query.token;
  if (!token) {
    return res.status(400).send("Token não fornecido.");
  }

  const html = `
 <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Pétala - Nova senha</title>
        <link rel="stylesheet" href="/css/global_nova_senha.css" />
        <link rel="icon" href="./frontend/assets/images/logoSemPetala.png" />
        <style>
          /* Caso queira inserir alguns estilos inline para garantir a compatibilidade */
          body { background-color: #FBE2E2; font-family: 'Montserrat', sans-serif; margin: 0; }
          header { display: flex; justify-content: space-between; align-items: center; padding: 20px; background: #fff; box-shadow: 0 4px 4px rgba(0,0,0,0.25); }
          .logo { width: 150px; }
          .voltar { background-color: #1F1717; color: #fff; border: none; border-radius: 10px; padding: 15px; cursor: pointer; }
          main { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; }
          .box { background: #fff; padding: 42px 20px; border-radius: 32px; box-shadow: 0 4px 4px rgba(0,0,0,0.25); }
          input { width: 381px; height: 50px; border-radius: 20px; background-color: #483636; color: rgba(250,250,250,0.70); border: none; margin: 15px auto; padding: 0 18px; font-size: 16px; display: block; }
          .p-button { background-color: #1F1717; color: #fff; border: none; border-radius: 20px; width: 190px; height: 55px; font-size: 20px; margin: 0 auto; display: block; cursor: pointer; }
          .p-button:hover { background-color: #120d0d; }
          .center-x { text-align: center; }
          .center-y { margin: 0 auto; }
          .first { font-size: 27px; text-align: center; }
          .negrito { font-weight: bold; }
        </style>
      </head>
      <body>
        <header>
          <img class="logo" src="./routes/images/Logo_cerejeira.png" alt="" />
          <button class="voltar" onclick="window.location.href='/login.html'">Voltar</button>
        </header>
        <main>
          <div class="flex column center-x center-y">
            <img class="moeda" src="./routes/images/petala_logo.png" alt="" />
            <div class="box card flex column center-y">
              <form id="recoveryForm" class="flex column center-x center-y">
                <p class="first" style="margin-bottom: 20px">Agora coloque a sua Nova Senha abaixo!</p>
                <input type="password" name="password" id="password" placeholder="Nova Senha" required />
                <input type="password" name="confirmPassword" id="confirmPassword" placeholder="Repita a nova Senha" required />
                <button class="p-button" type="submit">Redefinir senha</button>
              </form>
              <div id="successMessage" class="center-x center-y" style="display: none">
                <p class="first negrito">Sua senha foi alterada com sucesso!</p>
                <p class="second">
                  <a href="/login.html" class="message">Clique aqui para voltar ao login</a>
                </p>
              </div>
            </div>
          </div>
        </main>
        <script>
          document.addEventListener("DOMContentLoaded", () => {
            const recoveryForm = document.getElementById("recoveryForm");
            const successMessageDiv = document.getElementById("successMessage");
            const passwordInput = document.getElementById("password");
            const confirmPasswordInput = document.getElementById("confirmPassword");

            recoveryForm.addEventListener("submit", async (e) => {
              e.preventDefault();
              const password = passwordInput.value.trim();
              const confirmPassword = confirmPasswordInput.value.trim();
              if (!password || !confirmPassword) {
                alert("Preencha os dois campos.");
                return;
              }
              if (password !== confirmPassword) {
                alert("As senhas não conferem!");
                return;
              }
              try {
                const response = await fetch("http://localhost:3000/password-reset/reset", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ token: "${token}", newPassword: password })
                });
                const data = await response.json();
                if (response.ok) {
                  recoveryForm.style.display = "none";
                  successMessageDiv.style.display = "block";
                  successMessageDiv.innerText = data.message;
                } else {
                  alert(data.message || "Erro ao redefinir a senha.");
                }
              } catch (error) {
                console.error("Erro ao redefinir a senha:", error);
                alert("Erro ao redefinir a senha. Tente novamente mais tarde.");
              }
            });
          });
        </script>
      </body>
    </html>
  `;
  res.send(html);
});

module.exports = router;
