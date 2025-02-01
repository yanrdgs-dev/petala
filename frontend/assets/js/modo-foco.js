let countdownInterval = null;
let isStudyPhase = true;
let studyTimeMs, breakTimeMs;
const header = document.querySelector("header");
const historico = document.querySelectorAll('.historico');
function handleTimerClick() {
  if (localStorage.getItem("timerRunning") === "true") return;
  startPomodoro();
}

function startPomodoro() {
  const studyMinutes = parseInt(document.getElementById("studyTime").value, 10);
  const breakMinutes = parseInt(document.getElementById("breakTime").value, 10);

  if (isNaN(studyMinutes) || isNaN(breakMinutes) || studyMinutes <= 0 || breakMinutes <= 0) {
    alert("Por favor, defina tempos válidos para estudo e descanso.");
    return;
  }

  studyTimeMs = studyMinutes * 60 * 1000;
  breakTimeMs = breakMinutes * 60 * 1000;

  document.getElementById("studyTime").disabled = true;
  document.getElementById("breakTime").disabled = true;
  document.getElementById("stopBtn").disabled = false;

  isStudyPhase = true;
  localStorage.setItem("timerRunning", "true");
  localStorage.setItem("isStudyPhase", isStudyPhase);

  iniciarFase(studyTimeMs);
}

function iniciarFase(tempoFaseMs) {
  const endTime = Date.now() + tempoFaseMs;
  localStorage.setItem("endTime", endTime);

  atualizarDisplay(tempoFaseMs);

  // Estilizacao baseado no tempo
  if (isStudyPhase) {
    document.body.style.backgroundColor = "#5D2438"; 
    header.style.opacity = "0.7";
    historico.forEach(element => {
      element.style.opacity = "0.7";
    });
  } else {
    document.body.style.backgroundColor = "#FF8DA9"; 
    header.style.opacity = "1";
    historico.forEach(element => {
      element.style.opacity = "1";
    });
  }

  if (countdownInterval) clearInterval(countdownInterval);

  countdownInterval = setInterval(() => {
    const now = Date.now();
    const remaining = parseInt(localStorage.getItem("endTime"), 10) - now;

    if (remaining <= 0 || isNaN(remaining)) {
      clearInterval(countdownInterval);
      atualizarDisplay(0);
      
      if (isStudyPhase) {
        // alert("Fim do tempo de estudo!");    DEVE TER ALGO PARA SIMBOLIZAR O FIM DO TEMPO DE ESTUDO (SOM E COR)
        isStudyPhase = false;
        localStorage.setItem("isStudyPhase", isStudyPhase);
        iniciarFase(breakTimeMs);
      } else {
        // alert("Fim do tempo de descanso!");  DEVE TER ALGO PARA SIMBOLIZAR O FIM DO TEMPO DE ESTUDO (SOM E COR)
        isStudyPhase = true;
        localStorage.setItem("isStudyPhase", isStudyPhase);
        iniciarFase(studyTimeMs);
      }
    } else {
      atualizarDisplay(remaining);
    }
  }, 1000);
}

function atualizarDisplay(tempoMs) {
  const totalSeconds = Math.floor(tempoMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  document.getElementById("timerDisplay").innerText =
    String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
}

function stopTimer() {
  if (countdownInterval) clearInterval(countdownInterval);
  localStorage.removeItem("endTime");
  localStorage.removeItem("timerRunning");
  localStorage.removeItem("isStudyPhase");

  document.getElementById("studyTime").disabled = false;
  document.getElementById("breakTime").disabled = false;
  document.getElementById("stopBtn").disabled = true;

  document.getElementById("timerDisplay").innerText = "00:00";

  document.body.style.backgroundColor = "#FBE2E2";
  header.style.opacity = "1";
  historico.forEach(element => {
    element.style.opacity = "1";
  });


}

window.onload = function () {
  // Recuperar valores dos inputs salvos no navegador
  const savedStudyTime = localStorage.getItem("studyTime");
  const savedBreakTime = localStorage.getItem("breakTime");

  if (savedStudyTime) {
    document.getElementById("studyTime").value = savedStudyTime;
  }

  if (savedBreakTime) {
    document.getElementById("breakTime").value = savedBreakTime;
  }

  if (localStorage.getItem("timerRunning") === "true") {
    const storedEndTime = parseInt(localStorage.getItem("endTime"), 10);
    isStudyPhase = localStorage.getItem("isStudyPhase") === "true";

    document.getElementById("studyTime").disabled = true;
    document.getElementById("breakTime").disabled = true;
    document.getElementById("stopBtn").disabled = false;

    const remaining = storedEndTime - Date.now();
    if (remaining > 0) {
      atualizarDisplay(remaining);
      iniciarFase(remaining);
    } else {
      stopTimer();
    }
  }
};

// Salva o input do tempo de estudo e descanso no navegador
document.getElementById("studyTime").addEventListener("input", function () {
  localStorage.setItem("studyTime", this.value);
});

document.getElementById("breakTime").addEventListener("input", function () {
  localStorage.setItem("breakTime", this.value);
});

