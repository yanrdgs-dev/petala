const timerDisplay = document.getElementById("timerDisplay");
const stopBtn = document.getElementById("stopBtn");
const pauseBtn = document.getElementById("pauseBtn");
const studyTimeInput = document.getElementById("studyTime");
const breakTimeInput = document.getElementById("breakTime");
const header = document.querySelector("header");
const historicoContainer = document.querySelector(".historico");

const modalOverlay = document.getElementById("modalOverlay");
const modalConfirmBtn = document.getElementById("modalConfirmBtn");
const modalCancelBtn = document.getElementById("modalCancelBtn");

let studyTimer = null;
let totalSeconds = 0;
let elapsedSeconds = 0;
let remainingSeconds = 0;
let sessionRecorded = false;
let isPaused = false;

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function darkenPage() {
  document.body.style.backgroundColor = "#5D2438";
  header.style.opacity = "0.7";
  historicoContainer.style.opacity = "0.7";
}

function revertPage() {
  document.body.style.backgroundColor = "#FBE2E2";
  header.style.opacity = "1";
  historicoContainer.style.opacity = "1";
}

function startTimer() {
  const studyMinutes = parseInt(studyTimeInput.value, 10);
  if (isNaN(studyMinutes) || studyMinutes <= 0) {
    alert("Informe um tempo de estudo válido!");
    return;
  }
  totalSeconds = studyMinutes * 60;
  elapsedSeconds = 0;
  remainingSeconds = totalSeconds;
  sessionRecorded = false;
  isPaused = false;
  timerDisplay.textContent = formatTime(totalSeconds);
  stopBtn.disabled = false;
  pauseBtn.disabled = false;
  pauseBtn.textContent = "Pausar";

  darkenPage();

  studyTimer = setInterval(() => {
    if (!isPaused) {
      elapsedSeconds++;
      remainingSeconds--;
      timerDisplay.textContent = formatTime(remainingSeconds);
      if (remainingSeconds <= 0) {
        clearInterval(studyTimer);
        studyTimer = null;
        stopBtn.disabled = true;
        pauseBtn.disabled = true;
        recordFocusSessionOnce();

        openSwitchModal();

        revertPage();
      }
    }
  }, 1000);
}

function openSwitchModal() {
  modalOverlay.style.display = "flex"; 
}

function closeSwitchModal() {
  modalOverlay.style.display = "none";
}
function confirmSwitchMode() {
  closeSwitchModal();
  if (isStudyPhase) {
    // alert("Fim do estudo");
    isStudyPhase = false;
    localStorage.setItem("isStudyPhase", isStudyPhase);
    iniciarFase(breakTimeMs);
  } else {
    // alert("Fim do descanso");
    isStudyPhase = true;
    localStorage.setItem("isStudyPhase", isStudyPhase);
    iniciarFase(studyTimeMs);
  }
}

function cancelSwitchMode() {
  closeSwitchModal();
}

modalConfirmBtn.addEventListener("click", confirmSwitchMode);
modalCancelBtn.addEventListener("click", cancelSwitchMode);


function togglePause() {
  if (!studyTimer) return;
  if (isPaused) {
    isPaused = false;
    pauseBtn.textContent = "Pausar";
  } else {
    isPaused = true;
    pauseBtn.textContent = "Continuar";
  }

  pauseBtn.classList.add("active");
  setTimeout(() => pauseBtn.classList.remove("active"), 200);
}

function stopTimer() {
  if (studyTimer) {
    clearInterval(studyTimer);
    studyTimer = null;
  }
  stopBtn.disabled = true;
  pauseBtn.disabled = true;
  recordFocusSessionOnce();
  revertPage();
}

function recordFocusSessionOnce() {
  if (!sessionRecorded) {
    sessionRecorded = true;
    recordFocusSession();
  }
}

function recordFocusSession() {
  const studyMinutes = parseInt(studyTimeInput.value, 10);
  const plannedStudySeconds = studyMinutes * 60;
  const breakMinutes = parseInt(breakTimeInput.value, 10);
  const plannedBreakSeconds = breakMinutes * 60;

  const data = {
    studyTime: plannedStudySeconds,
    breakTime: plannedBreakSeconds,
    actualStudyDuration: elapsedSeconds,
  };

  const token = localStorage.getItem("token");
  fetch("http://localhost:3000/focus", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Erro ao registrar a sessão.");
      return response.json();
    })
    .then((session) => {
      console.log("Sessão registrada:", session);
      updateHistory();
    })
    .catch((error) => {
      console.error("Erro:", error);
    });
}

function updateHistory() {
  const token = localStorage.getItem("token");
  fetch("http://localhost:3000/focus", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((sessions) => {
      const histContainer = document.querySelector(".hist");
      histContainer.innerHTML = "";
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
        histContainer.appendChild(div);
      });
    })
    .catch((error) => console.error("Erro ao carregar histórico:", error));
}

function deleteSession(sessionId) {
  const token = localStorage.getItem("token");
  fetch(`http://localhost:3000/focus/${sessionId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) throw new Error("Erro ao deletar a sessão.");
      return response.json();
    })
    .then((data) => {
      console.log("Sessão deletada com sucesso:", data);
      updateHistory();
    })
    .catch((error) => console.error("Erro ao deletar a sessão:", error));
}

function handleTimerClick(event) {
  if (!studyTimer) {
    startTimer();
  }
}

document.querySelector(".clock").addEventListener("click", handleTimerClick);
stopBtn.addEventListener("click", stopTimer);
pauseBtn.addEventListener("click", togglePause);

updateHistory();
