// function getToken() {
//     return localStorage.getItem("token");
//   }
  
//   function getAuthHeaders() {
//     const token = getToken();
//     if (!token) {
//       alert("Usuário não autenticado. Faça login primeiro.");
//       return null;
//     }
//     return {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     };
//   }
  
//   async function fetchDashboard() {
//     const headers = getAuthHeaders();
//     if (!headers) return;
  
//     try {
//       const response = await fetch("http://localhost:3000/api/dashboard", {
//         method: "GET",
//         headers,
//       });
//       if (!response.ok) {
//         throw new Error("Erro ao buscar o dashboard");
//       }
  
//       const data = await response.json();
//       updateDashboardUI(data);
//     } catch (error) {
//       console.error("Erro ao buscar o dashboard: ", error);
//       alert("Erro ao buscar o dashboard. Tente novamente mais tarde.");
//     }
//   }
  
//   function updateDashboardUI(data) {
//     document.getElementById("tarefas-progresso").textContent =
//       data.tarefas_em_progresso;
//     document.getElementById("tarefas-concluidas").textContent =
//       data.tarefas_completas_semana;
//     document.getElementById("tempo-foco").textContent = data.tempo_foco_semana;
//     document.getElementById("provas-futuras").textContent = data.provas_futuras;
//   }
  
//   document.addEventListener("DOMContentLoaded", () => {
//     fetchDashboard();
//   });
  