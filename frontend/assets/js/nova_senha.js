document.addEventListener("DOMContentLoaded", () => {
  // Extrai o token da query string
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  if (!token) {
    alert("Token inválido ou ausente.");
    // window.location.href = "/login.html";
    return;
  }

  const recoveryForm = document.getElementById("recoveryForm");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const successMessageDiv = document.getElementById("successMessage");
  // const backPass = document.getElementById("voltarPass");
  // backPass.addEventListener("click", ()=>{
  //   window.location.href = "../../pages/login.html"
  // })
  recoveryForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();
    
    if (!password || !confirmPassword) {
      alert("Por favor, preencha os dois campos de senha.");
      return;
    }

    if (password !== confirmPassword) {
      alert("As senhas não conferem!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/password-reset/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token,
          newPassword: password
        })
      });

      const data = await response.json();

      if (response.ok) {
        recoveryForm.style.display = "none";
        successMessageDiv.style.display = "block";
      } else {
        alert(data.message || "Erro ao redefinir a senha.");
      }
    } catch (error) {
      console.error("Erro ao redefinir a senha:", error);
      alert("Erro ao redefinir a senha. Tente novamente mais tarde.");
    }
  });
  
} 
);
