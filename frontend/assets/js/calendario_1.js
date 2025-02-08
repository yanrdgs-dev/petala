const diasContainer = document.getElementById("dias");
const mesAno = document.getElementById("mes-ano");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const eventoForm = document.getElementById("evento-form");
const eventoTitulo = document.getElementById("evento-titulo");
const eventoDescricao = document.getElementById("evento-descricao");
const eventoHora = document.getElementById("evento-hora");
const cancelarEventoBtn = document.getElementById("cancelar-evento");

const modalOverlay = document.getElementById("modal-exibir");
const modalCreate = document.getElementById("modal-criar");
const closeBtn = document.getElementById("fechar-modal");

const viewEventModal = document.getElementById("viewEventModal");
const confirmEditBtn = document.getElementById("confirmEditBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const deleteEventBtn = document.getElementById("deleteEventBtn");

const API_URL = "http://localhost:3000/api/agenda";
const token = localStorage.getItem("token");

let dataAtual = new Date();
let eventos = {};

function agruparEventos(eventosArray) {
  const agrupados = {};
  eventosArray.forEach((evento) => {
    const dataKey = new Date(evento.data).toISOString().split("T")[0];
    if (!agrupados[dataKey]) {
      agrupados[dataKey] = [];
    }
    agrupados[dataKey].push(evento);
  });
  return agrupados;
}

async function carregarEventos() {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const eventosArray = await response.json();
      console.log("Eventos retornados:", eventosArray);
      eventos = agruparEventos(eventosArray);
      console.log("Eventos agrupados:", eventos);
      carregarCalendario(dataAtual);
    } else {
      console.error("Erro ao carregar eventos.");
    }
  } catch (error) {
    console.error("Erro ao carregar eventos: ", error);
  }
}

function carregarCalendario(data) {
  const mes = data.getMonth();
  const ano = data.getFullYear();
  const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
  const ultimoDia = new Date(ano, mes + 1, 0).getDate();

  mesAno.textContent = `${data.toLocaleDateString("pt-BR", {
    month: "long",
  })} ${ano}`;
  diasContainer.innerHTML = "";

  for (let i = 0; i < primeiroDiaSemana; i++) {
    const vazio = document.createElement("div");
    vazio.classList.add("dia");
    diasContainer.appendChild(vazio);
  }

  for (let dia = 1; dia <= ultimoDia; dia++) {
    const diaElemento = document.createElement("div");
    diaElemento.classList.add("dia");
    diaElemento.textContent = dia;

    const dataChave = `${ano}-${String(mes + 1).padStart(2, "0")}-${String(
      dia
    ).padStart(2, "0")}`;
    if (eventos[dataChave] && eventos[dataChave].length > 0) {
      const eventoBadge = document.createElement("span");
      eventoBadge.textContent = " 📅";
      diaElemento.appendChild(eventoBadge);
    }

    diaElemento.addEventListener("click", () => openEventModal(dataChave));
    diasContainer.appendChild(diaElemento);
  }
}

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

  eventosDoDia.forEach((evento) => {
    const li = document.createElement("li");
    li.textContent = evento.titulo;
    li.style.cursor = "pointer";
    li.addEventListener("click", () =>
      openViewEventModal(dataChave, evento.id)
    );
    ul.appendChild(li);
  });

  modalContent.appendChild(ul);
}

function openCreateModal() {
  modalOverlay.style.display = "none";
  modalCreate.style.display = "flex";
  eventoForm.dataset.dataChave =
    eventoForm.dataset.dataChave || new Date().toISOString().split("T")[0];
}

function fecharModal() {
  modalCreate.style.display = "none";
  modalOverlay.style.display = "none";
  eventoTitulo.value = "";
  eventoDescricao.value = "";
  eventoHora.value = "";
}

prevBtn.addEventListener("click", () => {
  dataAtual.setMonth(dataAtual.getMonth() );
  carregarCalendario(dataAtual);
});
nextBtn.addEventListener("click", () => {
  dataAtual.setMonth(dataAtual.getMonth() );
  carregarCalendario(dataAtual);
});

eventoForm.onsubmit = async (e) => {
  e.preventDefault();

  const titulo = eventoTitulo.value.trim();
  const descricao = eventoDescricao.value.trim();
  const hora = eventoHora.value.trim();

  if (!titulo) return alert("O título é obrigatório.");

  const regexHora = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (hora && !regexHora.test(hora)) {
    alert("Por favor, insira um horário válido no formato HH:MM.");
    return;
  }

  const dataChave = eventoForm.dataset.dataChave;
  const [ano, mes, dia] = dataChave.split("-");
  const dataEvento = new Date(ano, mes - 1, dia);
  const horario = hora;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        titulo,
        descricao,
        horario,
        data: dataEvento.toISOString().split("T")[0],
      }),
    });

    if (response.ok) {
      await carregarEventos();
      fecharModal();
    } else {
      alert("Erro ao criar evento.");
    }
  } catch (error) {
    console.error("Erro ao criar evento: ", error);
  }
};

// FUNÇÃO: Máscara simples para o input de horário
document.getElementById("evento-hora").addEventListener("input", function (e) {
  let value = e.target.value.replace(/\D/g, "");
  if (value.length > 4) value = value.slice(0, 4);
  if (value.length > 2) value = value.slice(0, 2) + ":" + value.slice(2);
  e.target.value = value;
});

// FUNÇÃO: Tornar um elemento editável com callback de atualização
function makeEditable(el, updateCallback, validate = null, formatter = null) {
  el.addEventListener("click", () => {
    el.contentEditable = "true";
    el.focus();
  });

  el.addEventListener("blur", () => {
    let newText = el.textContent.trim();
    if (formatter) {
      newText = formatter(newText);
      el.textContent = newText;
    }
    if (validate && newText !== "" && !validate(newText)) {
      alert("Formato inválido!");
      el.textContent = updateCallback(); // Restaura o valor original
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

function openViewEventModal(dataChave, eventoId) {
  modalOverlay.style.display = "none";

  const eventosDoDia = eventos[dataChave] || [];
  const evento = eventosDoDia.find((ev) => ev.id === eventoId);
  if (!evento) {
    console.error("Evento não encontrado!");
    return;
  }

  const original = {
    titulo: evento.titulo,
    descricao: evento.descricao,
    hora: evento.horario,
  };

  const viewTitleEl = document.getElementById("viewTitle");
  const viewDescriptionEl = document.getElementById("viewDescription");
  const viewTimeEl = document.getElementById("viewTime");

  viewTitleEl.textContent = evento.titulo || " ";
  viewDescriptionEl.textContent = evento.descricao || " ";
  viewTimeEl.textContent = evento.horario || " ";

  makeEditable(viewTitleEl, (newText) => {
    evento.titulo = newText;
    return evento.titulo;
  });
  makeEditable(viewDescriptionEl, (newText) => {
    evento.descricao = newText;
    return evento.descricao;
  });
  const regexHora = /^([01]\d|2[0-3]):([0-5]\d)$/;
  makeEditable(
    viewTimeEl,
    (newText) => {
      evento.horario = newText;
      return evento.horario;
    },
    (newText) => regexHora.test(newText),
    (text) => text
  );

  // Configura o botão para confirmar a edição
  confirmEditBtn.onclick = async () => {
    try {
      const response = await fetch(`${API_URL}/${evento.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          titulo: evento.titulo,
          descricao: evento.descricao,
          horario: evento.horario,
          data: dataChave,
        }),
      });

      if (response.ok) {
        viewEventModal.style.display = "none";
        await carregarEventos();
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
    evento.horario = original.hora;

    viewTitleEl.textContent = original.titulo;
    viewDescriptionEl.textContent = original.descricao;
    viewTimeEl.textContent = original.hora;
    viewEventModal.style.display = "none";
    openEventModal(dataChave);
  };

  deleteEventBtn.onclick = async () => {
    try {
      const response = await fetch(`${API_URL}/${evento.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const index = eventosDoDia.findIndex((ev) => ev.id === evento.id);
        if (index > -1) {
          eventosDoDia.splice(index, 1);
        }
        if (eventosDoDia.length === 0) {
          delete eventos[dataChave];
        }
        viewEventModal.style.display = "none";
        await carregarEventos();
        openEventModal(dataChave);
      } else {
        alert("Erro ao deletar evento.");
      }
    } catch (error) {
      console.error("Erro ao deletar evento: ", error);
    }
  };

  viewEventModal.style.display = "flex";
}

function closeEventList() {
  document.getElementById("modal-exibir").style.display = "none";
}

cancelarEventoBtn.addEventListener("click", fecharModal);
closeBtn.addEventListener("click", fecharModal);
function fecharModal() {
  modalCreate.style.display = "none";
  modalOverlay.style.display = "none";
  eventoTitulo.value = "";
  eventoDescricao.value = "";
  eventoHora.value = "";
}

prevBtn.addEventListener("click", () => {
  dataAtual.setMonth(dataAtual.getMonth() - 1);
  carregarCalendario(dataAtual);
});
nextBtn.addEventListener("click", () => {
  dataAtual.setMonth(dataAtual.getMonth() + 1);
  carregarCalendario(dataAtual);
});

carregarEventos();
