document.getElementById('loginForm').addEventListener('submit', async function (event) {
  event.preventDefault(); 

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.status === 200) {
    
      localStorage.setItem('token', data.token);

      alert('Login efetuado com sucesso!');
      
      window.location.href = './Pos_Login.html';
    } else {
      alert(data.message || 'Erro no login!');
    }
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    alert('Erro ao fazer login!');
  }
});

const resetPassword = document.getElementById('resetPasswordBtn');

resetPassword.addEventListener('click', () => {
  window.location.href = './email.html';
  })
document.getElementById('cadastrarUser').addEventListener('click', () => {
  window.location.href = './register.html';
});

