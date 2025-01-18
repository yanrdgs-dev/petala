const diasContainer = document.getElementById("dias");
const mesAno = document.getElementById("mes-ano");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const modal = document.getElementById("modal");
const closeModal = document.querySelector(".close");
const eventoForm = document.getElementById("evento-form");
const eventoDescricao = document.getElementById("evento-descricao");
const cancelarEventoBtn = document.getElementById("cancelar-evento");

let dataAtual = new Date();
let eventos = {}; 

function carregarCalendario(data) {
  const mes = data.getMonth();
  const ano = data.getFullYear();
  const primeiroDia = new Date(ano, mes, 1).getDay();
  const ultimoDia = new Date(ano, mes + 1, 0).getDate();

  mesAno.textContent = `${data.toLocaleDateString("pt-BR", {
    month: "long",
  })} ${ano}`;

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
    if (eventos[dataChave]) {
      const eventoBadge = document.createElement("span");
      eventoBadge.textContent = "📅";
      diaElemento.appendChild(eventoBadge);
    }

    diaElemento.addEventListener("click", () => abrirModal(dataChave));
    diasContainer.appendChild(diaElemento);
  }
}

function abrirModal(dataChave) {
  modal.style.display = "flex";
  eventoForm.dataset.dataChave = dataChave;
  eventoForm.onsubmit = (e) => {
    e.preventDefault();
    const descricao = eventoDescricao.value;
    if (!eventos[dataChave]) eventos[dataChave] = [];
    eventos[dataChave].push(descricao);
    eventoDescricao.value = "";
    modal.style.display = "none";
    carregarCalendario(dataAtual);
  };
  const eventosDoDia = eventos[dataChave] || [];
  const listaEventos = document.createElement("ul");
  listaEventos.id = "lista-eventos";
  listaEventos.innerHTML = "";

  eventosDoDia.forEach((evento, index) => {
    const item = document.createElement("li");
    item.textContent = `${index + 1}. ${evento}`;
    listaEventos.appendChild(item);
  });

  const conteudoModal = document.querySelector(".modal-content");
  const listaExistente = document.getElementById("lista-eventos");
  if (listaExistente) listaExistente.remove(); 
  conteudoModal.appendChild(listaEventos);
}

function fecharModal() {
  modal.style.display = "none";
  eventoDescricao.value = ""; // Limpar o campo de texto
}

cancelarEventoBtn.addEventListener("click", fecharModal);

closeModal.addEventListener("click", fecharModal);

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

prevBtn.addEventListener("click", () => {
  dataAtual.setMonth(dataAtual.getMonth() - 1);
  carregarCalendario(dataAtual);
});

nextBtn.addEventListener("click", () => {
  dataAtual.setMonth(dataAtual.getMonth() + 1);
  carregarCalendario(dataAtual);
});

eventoForm.onsubmit = (e) => {
  e.preventDefault();
  const descricao = eventoDescricao.value;
  if (!descricao.trim()) return; // Evita salvar se o texto estiver vazio
  const dataChave = eventoForm.dataset.dataChave; // Data armazenada ao abrir o modal
  if (!eventos[dataChave]) eventos[dataChave] = [];
  eventos[dataChave].push(descricao);
  fecharModal(); // Fechar modal após salvar
  carregarCalendario(dataAtual);
};

carregarCalendario(dataAtual);
