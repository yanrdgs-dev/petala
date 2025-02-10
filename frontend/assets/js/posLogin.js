const token = localStorage.getItem('token');
const welcomeMessage = document.getElementById('welcomeMessage');
const historyFoco = document.getElementById('hist');

if (!token) {
  alert('Você precisa estar logado!');
  window.location.href = '/login.html';
} else {
  const payload = JSON.parse(atob(token.split('.')[1])); 
  const username = payload.username;
  welcomeMessage.textContent = `Bem vindo, ${username}! Vamos estudar?`;
}

async function fetchDashboard() {
  try {
    const response = await fetch("http://localhost:3000/api/dashboard", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error("Erro ao buscar o dashboard");
    }
    const data = await response.json();
    updateDashboardUI(data);
    // Após atualizar o dashboard, atualiza também o histórico do modo foco
    updateFocusHistory();
  } catch (error) {
    console.error("Erro ao buscar o dashboard: ", error);
    alert("Erro ao buscar o dashboard. Tente novamente mais tarde.");
  }
}

function updateDashboardUI(data) {
  // Atualiza os elementos do dashboard com os dados retornados
  document.getElementById("tarefas-pendentes").textContent = data.tarefas_pendentes;
  document.getElementById("tarefas-concluidas").textContent = data.tarefas_concluidas;

  if (data.tempo_foco_semana) {
    const tempoFoco = data.tempo_foco_semana.split(":");
    const formattedTempoFoco = `${tempoFoco[0]}h${tempoFoco[1]}m`;
    document.getElementById("tempo-foco").textContent = formattedTempoFoco;
  }
}

async function resetDashboard() {
  try {
    const response = await fetch("http://localhost:3000/api/dashboard/zerar_semanal_automatico", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error("Erro ao resetar o dashboard");
    }
    fetchDashboard();
  } catch (error) {
    console.error("Erro ao resetar o dashboard: ", error);
    alert("Erro ao resetar o dashboard. Tente novamente mais tarde.");
  }
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

async function updateFocusHistory() {
  try {
    const response = await fetch("http://localhost:3000/focus", {
      headers: {
        
        "Authorization": `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error("Erro ao buscar histórico de foco");
    }
    const sessions = await response.json();
    historyFoco.innerHTML = ""; 
    sessions.forEach((session) => {
      const div = document.createElement("div");
      div.classList.add("prev-hist");
      const formattedStudy = formatTime(session.actualStudyDuration);
      const formattedBreak = formatTime(session.breakTime);
      div.innerHTML = `
        ${formattedStudy} de estudo<br>
        ${formattedBreak} de descanso
      `;
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Excluir";
      deleteBtn.classList.add("delete-session-btn");
      deleteBtn.addEventListener("click", () => {
        if (confirm("Tem certeza que deseja excluir essa sessão?")) {
          deleteSession(session.id);
        }
      });
      div.appendChild(deleteBtn);
      historyFoco.appendChild(div);
    });
  } catch (error) {
    console.error("Erro ao carregar histórico de foco:", error);
  }
}

async function deleteSession(sessionId) {
  try {
    const response = await fetch(`http://localhost:3000/focus/${sessionId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      },
    });
    if (!response.ok) {
      throw new Error("Erro ao deletar a sessão.");
    }
    const data = await response.json();
    console.log("Sessão deletada com sucesso:", data);
    updateFocusHistory();
  } catch (error) {
    console.error("Erro ao deletar a sessão:", error);
  }
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado');
    resetDashboard();
  });
} else {
  console.log('DOM carregado');
  resetDashboard();
}
