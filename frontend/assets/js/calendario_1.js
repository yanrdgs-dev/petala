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

// Modais e Botoes
const modalOverlay = document.getElementById("modal-exibir");
const modalCreate = document.getElementById("modal-criar");
const CreateBtn = document.getElementById("criar-evento");
const closeBtn = document.getElementById("fechar-modal")

// event detail (read-only)
const viewEventModal = document.getElementById("viewEventModal");
const closeViewBtn = document.getElementById("closeViewBtn");
const viewTitle = document.getElementById("viewTitle");
const viewDescription = document.getElementById("viewDescription");
const viewTime = document.getElementById("viewTime");

let dataAtual = new Date();

//o Gpt falo isso 
// Events are stored as an object where each key is a date string (e.g., "2025-2-15")
// and its value is an array of event objects { titulo, descricao, hora }

let eventos = {};

// --- Funções ---

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

    // Clicke do dia (abre o modal)
    diaElemento.addEventListener("click", () => openEventModal(dataChave));
    diasContainer.appendChild(diaElemento);
  }
}

// Abre o modal de eventos do dia clickado
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

  // Criação dos elementos da lista de eventos (como botões)
  eventosDoDia.forEach((evento, index) => {
    const li = document.createElement("li");
    li.textContent = `${evento.titulo}`;
    
    li.style.cursor = "pointer";
    
    // Função ao clickar no evento
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

// Função do borão "Cancelar"
cancelarEventoBtn.addEventListener("click", fecharModal);
closeBtn.addEventListener("click", fecharModal);
function fecharModal() {
  modalCreate.style.display = "none";
  modalOverlay.style.display = "none";
  eventoTitulo.value = "";
  eventoDescricao.value = "";
  eventoHora.value = "";
}

// Troca de mes
prevBtn.addEventListener("click", () => {
  dataAtual.setMonth(dataAtual.getMonth() - 1);
  carregarCalendario(dataAtual);
});

nextBtn.addEventListener("click", () => {
  dataAtual.setMonth(dataAtual.getMonth() + 1);
  carregarCalendario(dataAtual);
});

// Envio e criação do evento?
eventoForm.onsubmit = (e) => {
  e.preventDefault();

  const titulo = eventoTitulo.value;
  const descricao = eventoDescricao.value;
  const hora = eventoHora.value;

  // Titulo obrigatorio
  if (!titulo.trim()) return;

  const dataChave = eventoForm.dataset.dataChave;
  if (!eventos[dataChave]) {
    eventos[dataChave] = [];
  }
  eventos[dataChave].push({ titulo, descricao, hora });

  fecharModal();
  carregarCalendario(dataAtual);
};

// --- VIEW EVENT MODAL FUNCTIONS ---
// Função que abre o detalhes do evento clickado
function openViewEventModal(dataChave, index) {
  const evento = eventos[dataChave][index];

  // modalOverlay.style.display = "none";

  viewTitle.textContent = evento.titulo;
  viewDescription.textContent = evento.descricao;
  viewTime.textContent = evento.hora;

  viewEventModal.style.display = "flex";
}

// Sair do modal
closeViewBtn.addEventListener("click", () => {
  viewEventModal.style.display = "none";
});

// Carrega o calendario
carregarCalendario(dataAtual);
