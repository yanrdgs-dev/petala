const form = document.getElementById("recoveryForm");
const successMessage = document.getElementById("successMessage");

form.addEventListener("submit", function (event) {
  event.preventDefault();
  form.style.display = "none";
  successMessage.style.display = "block";
});


document.addEventListener("DOMContentLoaded", () => {
  const recoveryForm = document.getElementById("recoveryForm");
  const successMessageDiv = document.getElementById("successMessage");

  recoveryForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailInput = document.getElementById("email");
    const email = emailInput.value.trim();

    if (!email) {
      alert("Por favor, insira um e-mail válido.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/password-reset/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });
      

      const data = await response.json();

      if (response.ok) {
        // Esconde o formulário e exibe a mensagem de sucesso
        recoveryForm.style.display = "none";
        successMessageDiv.style.display = "block";
      } else {
        alert(data.message || "Erro ao enviar e-mail de recuperação.");
      }
    } catch (error) {
      console.error("Erro ao enviar o e-mail de recuperação:", error);
      alert("Erro ao enviar o e-mail de recuperação.");
    }
  });
});
