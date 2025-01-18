const form = document.getElementById("forgot-password-form");
const responseMessage = document.getElementById("response-message");
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  responseMessage.innerHTML = "";

  const email = document.getElementById("email").value;

  try {
    const response = await fetch(
      "http://localhost:3000/api/users/forgot-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      },
    );

    if (response.ok) {
      responseMessage.innerHTML = "Email de recuperação enviado com sucesso!";
    } else {
      const error = await response.json();
      responseMessage.innerHTML = error.message;
    }
  } catch (err) {
    console.error("Erro ao fazer requisição:", err);
    responseMessage.innerHTML =
      "Ocorreu um erro ao tentar recuperar a senha. Tente novamente.";
  }
});
