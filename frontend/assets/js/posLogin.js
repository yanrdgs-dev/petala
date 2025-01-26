const token = localStorage.getItem('token');
const welcomeMessage = document.getElementById('welcomeMessage');
const checklistButton = document.getElementById('checklistButton');

if (!token) {
  alert('Você precisa estar logado!');
  window.location.href = '/login.html';
} else {
  // Decodificar o token para extrair o nome do usuário
  const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica a parte do payload do token
  const username = payload.username;

  // Atualiza a mensagem de boas-vindas com o nome do usuário
  welcomeMessage.textContent = `Bem vindo, ${username}! Vamos estudar?`;
}

// Redireciona para a página de checklist
checklistButton.addEventListener('click', () => {
  window.location.href = './CheckList.html';
});
