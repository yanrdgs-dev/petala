const token = localStorage.getItem('token');
const welcomeMessage = document.getElementById('welcomeMessage');
// const checklistButton = document.getElementById('btn-checklist');

if (!token) {
  alert('Você precisa estar logado!');
  window.location.href = '/login.html';
} else {
  // Decodificar o token para extrair o nome do usuário
  const payload = JSON.parse(atob(token.split('.')[1])); 
  const username = payload.username;


  welcomeMessage.textContent = `Bem vindo, ${username}! Vamos estudar?`;
}

// checklistButton.addEventListener('click', () => {
// window.location.href = './CheckList.html';
// });

async function fetchDashboard() {
  try {
    const response = await fetch("http://localhost:3000/api/dashboard", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    });
    if (!response.ok) {
      throw new Error("Erro ao buscar o dashboard");
    }

    const data = await response.json();
    updateDashboardUI(data);
  } catch (error) {
    console.error("Erro ao buscar o dashboard: ", error);
    alert("Erro ao buscar o dashboard. Tente novamente mais tarde.");
  }
}

function updateDashboardUI(data) {
  document.getElementById("tarefas-progresso").textContent =
    data.tarefas_em_progresso;
  document.getElementById("tarefas-concluidas").textContent =
    data.tarefas_completas_semana;
    const tempoFoco = data.tempo_foco_semana.split(":");
    const formattedTempoFoco = `${tempoFoco[0]}h${tempoFoco[1]}m`;
    document.getElementById("tempo-foco").textContent = formattedTempoFoco;
}

async function resetDashboard() {
  try {
    const response = await fetch(
      "http://localhost:3000/api/dashboard/zerar_semanal_automatico",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao resetar o dashboard");
    }

    fetchDashboard();
  } catch (error) {
    console.error("Erro ao resetar o dashboard: ", error);
    alert("Erro ao resetar o dashboard. Tente novamente mais tarde.");
  }
}

if (document.readyState == 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('Dom loaded')
    resetDashboard();
  });
} else {
  console.log('Dom loaded')
  resetDashboard();
}
