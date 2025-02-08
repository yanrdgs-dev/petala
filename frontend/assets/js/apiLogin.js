document.getElementById('loginForm').addEventListener('submit', async function (event) {
  event.preventDefault(); // Evita o recarregamento da página

  // Captura os valores dos campos
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    // Faz a requisição ao backend
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.status === 200) {
      // Salva o token no localStorage
      localStorage.setItem('token', data.token);

      alert('Login efetuado com sucesso!');
      // Redireciona o usuário para a página pós-login
      window.location.href = './Pos_Login.html';
    } else {
      alert(data.message || 'Erro no login!');
    }
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    alert('Erro ao fazer login!');
  }
});

// Botão para redirecionar para a página de cadastro
document.getElementById('cadastrarUser').addEventListener('click', () => {
  window.location.href = './register.html';
});


const btnForgotPass = document.getElementById("forgotPassword")

btnForgotPass.addEventListener("click", () => {
  window.location.href = "./email.html" 
})