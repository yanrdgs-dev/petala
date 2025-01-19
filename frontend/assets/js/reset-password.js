const form = document.getElementById("reset-password-form");
const responseMessage = document.getElementById("response-message");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const newPassword = document.getElementById("new-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (newPassword !== confirmPassword) {
    responseMessage.innerHTML = "As senhas não coincidem.";
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:3000/api/users/reset-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password: newPassword }),
      },
    );

    if (response.ok) {
      responseMessage.innerHTML = "Senha redefinida com sucesso!";
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
