const form = document.getElementById("registerForm");
const errorMessages = document.getElementById("errorMessages");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  errorMessages.innerHTML = "";

  const username = document.getElementById("username").value;
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Verificando se as senhas coincidem
  if (password !== confirmPassword) {
    errorMessages.innerHTML = "As senhas não coincidem.";
    return;
  }

  const data = {
    username: username,
    name: name,
    email: email,
    password: password,
  };
  try {
    const response = await fetch("http://localhost:3000/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();
      errorMessages.innerHTML = "Cadastro feito com sucesso. Redirecionando...";
      localStorage.setItem("username", result.username);
      window.location.href = "./dashboard.html";
    } else {
      const errorData = await response.json();
      if (
        errorData.errors &&
        Array.isArray(errorData.errors) &&
        errorData.errors.length > 0
      ) {
        errorMessages.innerHTML = `${errorData.errors[0].msg}`;
        console.log(errorData.errors);
      } else {
        errorMessages.innerHTML = `${errorData.message}`;
      }
    }
  } catch (error) {
    console.error("Erro ao fazer requisição:", error);
    errorMessages.innerHTML =
      "Ocorreu um erro ao tentar se cadastrar. Tente novamente.";
  }
});
