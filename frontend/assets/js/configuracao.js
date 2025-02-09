 const token = localStorage.getItem('token');

 if (!token) {
   alert('Você precisa estar logado!');
   window.location.href = '/login.html';
 } else {
   const payload = JSON.parse(atob(token.split('.')[1])); 
   const username = payload.username;
   const email = payload.email;

   document.getElementById("username").textContent = username;
   document.getElementById("email").textContent = email;
}
