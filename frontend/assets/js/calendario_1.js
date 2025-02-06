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
const closeViewBtn = document.getElementById("closeViewBtn");

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
closeViewBtn.addEventListener("click", () => {
  viewEventModal.style.display = "none";
});

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

function openViewEventModal(dataChave, index) {
  const evento = eventos[dataChave][index];

  const viewTitleEl = document.getElementById("viewTitle");
  const viewDescriptionEl = document.getElementById("viewDescription");
  const viewTimeEl = document.getElementById("viewTime");

  viewTitleEl.textContent = evento.titulo || " ";
  viewDescriptionEl.textContent = evento.descricao || " ";
  viewTimeEl.textContent = evento.hora || " ";

  // Função para permitir edição inline
  function makeEditable(el, updateCallback, validate = null) {
    el.addEventListener("click", function enableEditing() {
      el.contentEditable = "true";
      el.focus();
      el.removeEventListener("click", enableEditing);
    });

    el.addEventListener("blur", () => {
      let newText = el.textContent.trim();
      if (validate && !validate(newText) && newText !== "") {
        alert("Formato inválido! Use HH:MM - HH:MM.");
        el.textContent = updateCallback(); // Restaura o valor anterior se for inválido
      } else {
        updateCallback(newText);
      }
      el.contentEditable = "false";
      el.addEventListener("click", enableEditing);
    });

    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        el.blur();
      }
    });
  }

  const regexHora = /^([01]\d|2[0-3]):([0-5]\d) - ([01]\d|2[0-3]):([0-5]\d)$/;

  makeEditable(viewTitleEl, (newText) => evento.titulo = newText);
  makeEditable(viewDescriptionEl, (newText) => evento.descricao = newText);
  makeEditable(viewTimeEl, (newText) => {
    if (newText === "" || regexHora.test(newText)) {
      evento.hora = newText || " ";
      return newText || " ";
    }
    return evento.hora; // Restaura valor antigo se for inválido
  }, (text) => regexHora.test(text));

  viewEventModal.style.display = "flex";
}




// Carrega o calendário
carregarCalendario(dataAtual);
