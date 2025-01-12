const diasContainer = document.getElementById("dias");
const mesAno = document.getElementById("mes-ano");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let dataAtual = new Date();

function carregarCalendario(data) {
  const mes = data.getMonth();
  const ano = data.getFullYear();
  const primeiroDia = new Date(ano, mes, 1).getDay();
  const ultimoDia = new Date(ano, mes + 1, 0).getDate();

  // Atualizar o título
  mesAno.textContent = `${data.toLocaleDateString("pt-BR", {
    month: "long",
  })} ${ano}`;

  // Limpar dias anteriores
  diasContainer.innerHTML = "";

  // Adicionar espaços para os dias antes do primeiro dia do mês
  for (let i = 0; i < primeiroDia; i++) {
    const vazio = document.createElement("div");
    vazio.classList.add("dia");
    diasContainer.appendChild(vazio);
  }

  // Adicionar os dias do mês
  for (let dia = 1; dia <= ultimoDia; dia++) {
    const diaElemento = document.createElement("div");
    diaElemento.classList.add("dia");
    diaElemento.textContent = dia;
    diasContainer.appendChild(diaElemento);
  }
}

// Navegação
prevBtn.addEventListener("click", () => {
  dataAtual.setMonth(dataAtual.getMonth() - 1);
  carregarCalendario(dataAtual);
});

nextBtn.addEventListener("click", () => {
  dataAtual.setMonth(dataAtual.getMonth() + 1);
  carregarCalendario(dataAtual);
});

// Inicializar calendário
carregarCalendario(dataAtual);