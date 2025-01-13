const diasContainer = document.getElementById("dias");
const mesAno = document.getElementById("mes-ano");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const modal = document.getElementById("modal");
const closeModal = document.querySelector(".close");
const eventoForm = document.getElementById("evento-form");
const eventoDescricao = document.getElementById("evento-descricao");

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
  eventoForm.onsubmit = (e) => {
    e.preventDefault();
    const descricao = eventoDescricao.value;
    if (!eventos[dataChave]) eventos[dataChave] = [];
    eventos[dataChave].push(descricao);
    eventoDescricao.value = "";
    modal.style.display = "none";
    carregarCalendario(dataAtual);
  };
}

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

carregarCalendario(dataAtual);
