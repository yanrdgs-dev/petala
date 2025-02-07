// 
const diasContainer = document.getElementById("dias");
const mesAno = document.getElementById("mes-ano");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

// Criação de eventos
const eventoForm = document.getElementById("evento-form");
const eventoTitulo = document.getElementById("evento-titulo");
const eventoDescricao = document.getElementById("evento-descricao");
const eventoHora = document.getElementById("evento-hora");
const cancelarEventoBtn = document.getElementById("cancelar-evento");

// Modais e Botões
const modalOverlay = document.getElementById("modal-exibir");
const modalCreate = document.getElementById("modal-criar");
const CreateBtn = document.getElementById("criar-evento");
const closeBtn = document.getElementById("fechar-modal");

const viewEventModal = document.getElementById("viewEventModal");
const confirmEditBtn = document.getElementById("confirmEditBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");


let dataAtual = new Date();


//explicação ???
// Events are stored as an object where each key is a date string (e.g., "2025-2-15")
// and its value is an array of event objects { titulo, descricao, hora }
let eventos = {};

// --- Funções ---

// Criação do calendario
function carregarCalendario(data) {
  const mes = data.getMonth();
  const ano = data.getFullYear();
  const primeiroDia = new Date(ano, mes, 1).getDay();
  const ultimoDia = new Date(ano, mes + 1, 0).getDate();

  mesAno.textContent = `${data.toLocaleDateString("pt-BR", { month: "long" })} ${ano}`;

  diasContainer.innerHTML = "";

  for (let i = 0; i < primeiroDia; i++) {
    const vazio = document.createElement("div");
    vazio.classList.add("dia");
    diasContainer.appendChild(vazio);
  }

  for (let dia = 1; dia <= ultimoDia; dia++) {
    const diaElemento = document.createElement("div");
    diaElemento.classList.add("dia");
    diaElemento.textContent = dia;

    const dataChave = `${ano}-${mes + 1}-${dia}`;
    if (eventos[dataChave] && eventos[dataChave].length > 0) {
      const eventoBadge = document.createElement("span");
      eventoBadge.textContent = " 📅";
      diaElemento.appendChild(eventoBadge);
    }

    // função de cickar no dia do calendario
    diaElemento.addEventListener("click", () => openEventModal(dataChave));
    diasContainer.appendChild(diaElemento);
  }
}

// Abre a lista de eventos do dia
function openEventModal(dataChave) {
  modalOverlay.style.display = "flex";
  eventoForm.dataset.dataChave = dataChave;

  const modalContent = modalOverlay.querySelector(".modal");
  let listaExistente = modalContent.querySelector("#lista-eventos");
  if (listaExistente) {
    listaExistente.remove();
  }

  // Cria a lista de eventos
  const eventosDoDia = eventos[dataChave] || [];
  const ul = document.createElement("ul");
  ul.id = "lista-eventos";

  // cada <li> é um botão
  eventosDoDia.forEach((evento, index) => {
    const li = document.createElement("li");
    li.textContent = `${evento.titulo}`;
    li.style.cursor = "pointer";
    li.addEventListener("click", () => {
      openViewEventModal(dataChave, index);

    });
    ul.appendChild(li);
  });

  modalContent.appendChild(ul);
}

// Abre o modal "create event" 
function openCreateModal() {
  modalOverlay.style.display = "none"; 
  modalCreate.style.display = "flex";

  // Garante que a data do evento está armazenada no formulário
  eventoForm.dataset.dataChave = eventoForm.dataset.dataChave || new Date().toISOString().split("T")[0];
}


// funcionalidade do botão"Cancel" 
cancelarEventoBtn.addEventListener("click", fecharModal);
closeBtn.addEventListener("click", fecharModal);
function fecharModal() {
  modalCreate.style.display = "none";
  modalOverlay.style.display = "none";
  eventoTitulo.value = "";
  eventoDescricao.value = "";
  eventoHora.value = "";
}

// Trocar mes
prevBtn.addEventListener("click", () => {
  dataAtual.setMonth(dataAtual.getMonth() - 1);
  carregarCalendario(dataAtual);
});

nextBtn.addEventListener("click", () => {
  dataAtual.setMonth(dataAtual.getMonth() + 1);
  carregarCalendario(dataAtual);
});

// Criação de evento
eventoForm.onsubmit = (e) => {
  e.preventDefault();

  const titulo = eventoTitulo.value.trim();
  const descricao = eventoDescricao.value.trim();
  const hora = eventoHora.value.trim();  

  // Verifica se o título está vazio 
  if (!titulo) return;

  // Se o usuário digitou algo no horário, testa para o formato o formato
  const regexHora = /^([01]\d|2[0-3]):([0-5]\d) - ([01]\d|2[0-3]):([0-5]\d)$/;
  if (hora && !regexHora.test(hora)) {
    alert("Por favor, insira um horário válido no formato HH:MM - HH:MM.");
    return;
  }

  const dataChave = eventoForm.dataset.dataChave;
  if (!eventos[dataChave]) {
    eventos[dataChave] = [];
  }

  eventos[dataChave].push({ titulo, descricao, hora: hora || " " });

  fecharModal();
  carregarCalendario(dataAtual);
};

document.getElementById("evento-hora").addEventListener("input", function (e) {
  let value = e.target.value.replace(/\D/g, ""); // Remove caracteres não numéricos
  if (value.length > 4) value = value.slice(0, 4) + " - " + value.slice(4);
  if (value.length > 2) value = value.slice(0, 2) + ":" + value.slice(2);
  if (value.length > 10) value = value.slice(0, 10) + ":" + value.slice(10);
  e.target.value = value;
});

// --- função do modal VIEW EVENT  ---

// Cria divs 
// A div é editavel
// A edição é atualizada
function createEditableDiv(className, initialText, updateCallback) {
  const div = document.createElement("div");
  div.classList.add(className);
  div.textContent = initialText;

  div.addEventListener("click", () => {
    div.contentEditable = "true";
    div.focus();
  });

  div.addEventListener("blur", () => {
    div.contentEditable = "false";
    updateCallback(div.textContent);
  });

  div.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      div.blur();
    }
  });

  return div;
}

// --- FUNÇÃO openViewEventModal ---
// --- Function openViewEventModal ---
// Helper function to format a time string to "HH:MM - HH:MM"
function formatTime(text) {
  let digits = text.replace(/\D/g, "");
  if (digits.length === 0) return "";
  if (digits.length > 8) {
    digits = digits.slice(0, 8);
  }
  if (digits.length >= 5) {
    let startHour = digits.slice(0, 2);
    let startMin = digits.slice(2, 4);
    let endHour = digits.slice(4, 6);
    let endMin = digits.slice(6, 8);
    let formatted = startHour + ":" + startMin + " - " + endHour;
    if (endMin) {
      formatted += ":" + endMin;
    }
    return formatted;
  } else if (digits.length >= 3) {
    return digits.slice(0, 2) + ":" + digits.slice(2);
  } else {
    return digits;
  }
}

// Enhanced makeEditable function that stops propagation on click
// and applies an optional formatter on blur.
function makeEditable(el, updateCallback, validate = null, formatter = null) {
  function enableEditing(e) {
    e.stopPropagation();
    el.contentEditable = "true";
    el.focus();
  }
  el.addEventListener("click", enableEditing);

  el.addEventListener("blur", () => {
    let newText = el.textContent.trim();
    if (formatter) {
      newText = formatter(newText);
      el.textContent = newText;
    }
    if (validate && newText !== "" && !validate(newText)) {
      alert("Formato inválido! Use HH:MM - HH:MM.");
      el.textContent = updateCallback(); // Restore current value if invalid.
    } else {
      updateCallback(newText);
    }
    el.contentEditable = "false";
  });

  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      el.blur();
    }
  });
}

// Function openViewEventModal: opens the view/edit modal for a given event.
function openViewEventModal(dataChave, index) {
  // Close the initial event list overlay.
  modalOverlay.style.display = "none";

  if (!eventos[dataChave] || !eventos[dataChave][index]) {
    console.error("Evento não encontrado!");
    return;
  }
  const evento = eventos[dataChave][index];

  // Store original values to allow restoration if the user cancels.
  const original = {
    titulo: evento.titulo,
    descricao: evento.descricao,
    hora: evento.hora,
  };

  // Get references to the existing elements in the view modal.
  const viewTitleEl = document.getElementById("viewTitle");
  const viewDescriptionEl = document.getElementById("viewDescription");
  const viewTimeEl = document.getElementById("viewTime");

  // Update the elements with the current event data.
  viewTitleEl.textContent = evento.titulo || " ";
  viewDescriptionEl.textContent = evento.descricao || " ";
  viewTimeEl.textContent = evento.hora || " ";

  // Regex to validate the time format "HH:MM - HH:MM"
  const regexHora = /^([01]\d|2[0-3]):([0-5]\d) - ([01]\d|2[0-3]):([0-5]\d)$/;

  deleteEventBtn.dataset.dataChave = dataChave;
  deleteEventBtn.dataset.index = index;

  // Enable inline editing for the title.
  makeEditable(viewTitleEl, (newText) => {
    evento.titulo = newText;
    return evento.titulo;
  });

  // Enable inline editing for the description.
  makeEditable(viewDescriptionEl, (newText) => {
    evento.descricao = newText;
    return evento.descricao;
  });

  // Enable inline editing for the time, applying the formatter.
  makeEditable(
    viewTimeEl,
    (newText) => {
      evento.hora = newText || " ";
      return evento.hora;
    },
    (newText) => regexHora.test(newText),
    formatTime
  );

  // Get the confirm and cancel buttons from the HTML.
  const confirmEditBtn = document.getElementById("confirmEditBtn");
  const cancelEditBtn = document.getElementById("cancelEditBtn");

  // When confirming, simply close the view modal and update the calendar.
  confirmEditBtn.onclick = () => {
    viewEventModal.style.display = "none";
    carregarCalendario(dataAtual);
  };

  // When canceling, restore original values and close the view modal.
  cancelEditBtn.onclick = () => {
    evento.titulo = original.titulo;
    evento.descricao = original.descricao;
    evento.hora = original.hora;

    viewTitleEl.textContent = original.titulo;
    viewDescriptionEl.textContent = original.descricao;
    viewTimeEl.textContent = original.hora;
    viewEventModal.style.display = "none";
  };

  // Finally, display the view event modal.
  viewEventModal.style.display = "flex";
}

// Function to close the event list modal.
function closeEventList() {
  document.getElementById("modal-exibir").style.display = "none";
}

// Selecionar o botão de apagar
const deleteEventBtn = document.getElementById("deleteEventBtn");

// Função para apagar o evento
function deleteEvent(dataChave, index) {
  if (confirm("Tem certeza que deseja apagar este evento?")) {
    eventos[dataChave].splice(index, 1); // Remove o evento da lista

    // Se não houver mais eventos nesse dia, remover a chave do objeto
    if (eventos[dataChave].length === 0) {
      delete eventos[dataChave];
    }

    // Fechar modal e atualizar o calendário
    viewEventModal.style.display = "none";
    carregarCalendario(dataAtual);
  }
}

// Adicionar evento de clique ao botão
deleteEventBtn.addEventListener("click", () => {
  const dataChave = deleteEventBtn.dataset.dataChave;
  const index = parseInt(deleteEventBtn.dataset.index, 10);
  deleteEvent(dataChave, index);
});


// Finally, load the calendar.
carregarCalendario(dataAtual);

