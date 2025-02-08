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
const deleteEventBtn = document.getElementById("deleteEventBtn");
const API_URL = "http://localhost:3000/api/agenda";
const token = localStorage.getItem("token");

let dataAtual = new Date();
let eventos = {};

// Funções

// Função para carregar os eventos do backend
async function carregarEventos() {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (response.ok) {
      eventos = await response.json();
      carregarCalendario(dataAtual);
    } else {
      console.error("Erro ao carregar eventos.");
    }
  } catch (error) {
    console.error("Erro ao carregar eventos: ", error);
  }
}

// Criação do calendário
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

  const eventosDoDia = eventos[dataChave] || [];
  const ul = document.createElement("ul");
  ul.id = "lista-eventos";

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

  eventoForm.dataset.dataChave = eventoForm.dataset.dataChave || new Date().toISOString().split("T")[0];
}

// Funcionalidade do botão "Cancel"
cancelarEventoBtn.addEventListener("click", fecharModal);
closeBtn.addEventListener("click", fecharModal);
function fecharModal() {
  modalCreate.style.display = "none";
  modalOverlay.style.display = "none";
  eventoTitulo.value = "";
  eventoDescricao.value = "";
  eventoHora.value = "";
}

// Trocar mês
prevBtn.addEventListener("click", () => {
  dataAtual.setMonth(dataAtual.getMonth() - 1);
  carregarCalendario(dataAtual);
});

nextBtn.addEventListener("click", () => {
  dataAtual.setMonth(dataAtual.getMonth() + 1);
  carregarCalendario(dataAtual);
});

// Criação de evento
eventoForm.onsubmit = async (e) => {
  e.preventDefault();

  const titulo = eventoTitulo.value.trim();
  const descricao = eventoDescricao.value.trim();
  const hora = eventoHora.value.trim();

  if (!titulo) return;

  const regexHora = /^([01]\d|2[0-3]):([0-5]\d) - ([01]\d|2[0-3]):([0-5]\d)$/;
  if (hora && !regexHora.test(hora)) {
    alert("Por favor, insira um horário válido no formato HH:MM - HH:MM.");
    return;
  }

  const dataChave = eventoForm.dataset.dataChave;
  const [ano, mes, dia] = dataChave.split("-");
  const data = new Date(ano, mes - 1, dia);
  const horario = hora.split(" - ")[0];

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        titulo,
        descricao,
        horario,
        data: data.toISOString().split("T")[0]
      }),
    });

    if (response.ok) {
      if (!eventos[dataChave]) {
        eventos[dataChave] = [];
      }
      eventos[dataChave].push({ titulo, descricao, hora });
      fecharModal();
      carregarCalendario(dataAtual);
    } else {
      alert("Erro ao criar evento.");
    }
  } catch (error) {
    console.error("Erro ao criar evento: ", error);
  }
};

document.getElementById("evento-hora").addEventListener("input", function (e) {
  let value = e.target.value.replace(/\D/g, "");
  if (value.length > 4) value = value.slice(0, 4) + " - " + value.slice(4);
  if (value.length > 2) value = value.slice(0, 2) + ":" + value.slice(2);
  if (value.length > 10) value = value.slice(0, 10) + ":" + value.slice(10);
  e.target.value = value;
});

// Função do modal VIEW EVENT
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
      el.textContent = updateCallback();
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

function openViewEventModal(dataChave, index) {
  modalOverlay.style.display = "none";

  if (!eventos[dataChave] || !eventos[dataChave][index]) {
    console.error("Evento não encontrado!");
    return;
  }
  const evento = eventos[dataChave][index];

  const original = {
    titulo: evento.titulo,
    descricao: evento.descricao,
    hora: evento.hora,
  };

  const viewTitleEl = document.getElementById("viewTitle");
  const viewDescriptionEl = document.getElementById("viewDescription");
  const viewTimeEl = document.getElementById("viewTime");

  viewTitleEl.textContent = evento.titulo || " ";
  viewDescriptionEl.textContent = evento.descricao || " ";
  viewTimeEl.textContent = evento.hora || " ";

  const regexHora = /^([01]\d|2[0-3]):([0-5]\d) - ([01]\d|2[0-3]):([0-5]\d)$/;

  deleteEventBtn.dataset.dataChave = dataChave;
  deleteEventBtn.dataset.index = index;

  makeEditable(viewTitleEl, (newText) => {
    evento.titulo = newText;
    return evento.titulo;
  });

  makeEditable(viewDescriptionEl, (newText) => {
    evento.descricao = newText;
    return evento.descricao;
  });

  makeEditable(
    viewTimeEl,
    (newText) => {
      evento.hora = newText || " ";
      return evento.hora;
    },
    (newText) => regexHora.test(newText),
    formatTime
  );

  confirmEditBtn.onclick = async () => { //Desgraçaaaaaaa
    try {
      const response = await fetch(`${API_URL}/${index}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          titulo: evento.titulo,
          descricao: evento.descricao,
          horario: evento.hora.split(" - ")[0],
          data: dataChave
        })
      });

      if (response.ok) {
        viewEventModal.style.display = "none";
        carregarCalendario(dataAtual);
        openEventModal(dataChave);
      } else {
        alert("Erro ao atualizar evento.");
      }
    } catch (error) {
      console.error("Erro ao atualizar evento: ", error);
    }
  };

  cancelEditBtn.onclick = () => {
    evento.titulo = original.titulo;
    evento.descricao = original.descricao;
    evento.hora = original.hora;

    viewTitleEl.textContent = original.titulo;
    viewDescriptionEl.textContent = original.descricao;
    viewTimeEl.textContent = original.hora;
    viewEventModal.style.display = "none";
    openEventModal(dataChave);
  };

  viewEventModal.style.display = "flex";
}

function closeEventList() {
  document.getElementById("modal-exibir").style.display = "none";
}

deleteEventBtn.addEventListener("click", async () => { // Desgraçaaaaaaaaa
  const dataChave = deleteEventBtn.dataset.dataChave;
  const index = parseInt(deleteEventBtn.dataset.index, 10);

  try {
    const response = await fetch(`${API_URL}/${index}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });

    if (response.ok) {
      eventos[dataChave].splice(index, 1);
      if (eventos[dataChave].length === 0) {
        delete eventos[dataChave];
      }
      viewEventModal.style.display = "none";
      carregarCalendario(dataAtual);
      openEventModal(dataChave);
    } else {
      alert("Erro ao deletar evento.");
    }
  } catch (error) {
    console.error("Erro ao deletar evento: ", error);
  }
});

carregarEventos();
carregarCalendario(dataAtual);