const token = localStorage.getItem('token');
const welcomeMessage = document.getElementById('welcomeMessage');
const checklistButton = document.getElementById('btn-checklist');

if (!token) {
  alert('Você precisa estar logado!');
  window.location.href = '/login.html';
} else {
  // Decodificar o token para extrair o nome do usuário
  const payload = JSON.parse(atob(token.split('.')[1])); 
  const username = payload.username;


  welcomeMessage.textContent = `Bem vindo, ${username}! Vamos estudar?`;
}

checklistButton.addEventListener('click', () => {
  window.location.href = './CheckList.html';
});
