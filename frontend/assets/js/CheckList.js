const API_URL = "http://localhost:3000/api/checklists";
const token = localStorage.getItem("token");

async function fetchTasks() {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Erro ao buscar tarefas.");

    const tasks = await response.json();
    renderTasks(tasks);
  } catch (error) {
    console.error(error);
    alert("Erro ao buscar tarefas.");
  }
}

async function addTask(listId, inputId) {
  const inputElement = document.getElementById(inputId);
  if (!inputElement) {
    console.error(`Elemento de input não encontrado: ${inputId}`);
    return;
  }

  const taskTitle = inputElement.value.trim();
  if (!taskTitle) {
    alert("O título da tarefa é obrigatório.");
    return;
  }

  const statusMap = {
    "lista-em-andamento": "pendente",
    "lista-revisar": "revisar",
    "lista-Concluido": "concluida",
  };

  const newTask = {
    titulo: taskTitle,
    status: statusMap[listId] || "pendente", // Define o status correto com base na coluna
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newTask),
    });

    if (!response.ok) {
      throw new Error("Erro ao criar tarefa.");
    }

    inputElement.value = ""; // Limpa o campo de entrada
    fetchTasks(); // Atualiza a lista de tarefas
  } catch (error) {
    console.error(error);
    alert("Erro ao criar tarefa.");
  }
}

async function deleteTask(taskId) {
  try {
    const response = await fetch(`${API_URL}/${taskId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Erro ao excluir a tarefa.");

    fetchTasks();
    alert("Tarefa excluída com sucesso!");
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

async function saveEdit(taskId, updatedData) {
  try {
    const response = await fetch(`${API_URL}/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) throw new Error("Erro ao atualizar tarefa.");

    fetchTasks();
  } catch (error) {
    console.error(error);
    alert("Erro ao atualizar tarefa.");
  }
}

function renderTasks(tasks) {
  const taskContainers = {
    pendente: document.getElementById("lista-em-andamento"),
    revisar: document.getElementById("lista-revisar"),
    concluida: document.getElementById("lista-Concluido"),
  };

  Object.values(taskContainers).forEach(
    (container) => (container.innerHTML = "")
  );

  tasks.forEach((task) => {
    const taskElement = document.createElement("li");
    taskElement.textContent = task.titulo;
    taskElement.setAttribute("data-id", task.id);

    const editButton = document.createElement("button");
    editButton.innerHTML = "<i class='fa-solid fa-pen'></i>";
    editButton.onclick = () => openEditModal(task.id, task.titulo);

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "<i class='fa-solid fa-trash'></i>";
    deleteButton.onclick = () => deleteTask(task.id);

    taskElement.appendChild(editButton);
    taskElement.appendChild(deleteButton);

    if (taskContainers[task.status]) {
      taskContainers[task.status].appendChild(taskElement);
    } else {
      console.warn(`Status desconhecido: ${task.status}`);
    }
  });
}

function openEditModal(taskId, currentTitle) {
  const modal = document.getElementById("editModal");
  const modalInput = document.getElementById("modalInput");
  const saveButton = document.getElementById("saveEdit");

  modalInput.value = currentTitle;
  modal.style.display = "flex";

  saveButton.onclick = () => {
    const updatedData = { titulo: modalInput.value.trim() };
    saveEdit(taskId, updatedData);
    modal.style.display = "none";
  };
}

document.getElementById("cancelEdit").onclick = () => {
  document.getElementById("editModal").style.display = "none";
};

document.querySelectorAll(".edit-task-button").forEach(button => {
  button.addEventListener("click", function () {
      // Remove a classe de qualquer outra task que já estava selecionada antes
      document.querySelectorAll(".task-being-edited").forEach(task => {
          task.classList.remove("task-being-edited");
      });

      // Adiciona a classe à task correta
      const taskElement = this.closest(".task"); // Supondo que cada task tenha a classe "task"
      if (taskElement) {
          taskElement.classList.add("task-being-edited");
          console.log("Task selecionada para edição:", taskElement);
      } else {
          console.warn("Nenhuma task foi selecionada!");
      }

      // Abre o modal
      document.getElementById("editModal").style.display = "block";
  });
});

document.querySelectorAll(".edit-task-button").forEach(button => {
  button.addEventListener("click", function () {
      // Remove a marcação de qualquer task que estava sendo editada antes
      document.querySelectorAll(".task-being-edited").forEach(task => {
          task.classList.remove("task-being-edited");
      });

      // Encontra a task correta a partir do botão clicado
      const taskElement = this.closest(".task");

      if (taskElement) {
          taskElement.classList.add("task-being-edited");
          console.log("Task selecionada para edição:", taskElement);
      } else {
          console.warn("Nenhuma task foi selecionada!");
          return; // Evita abrir o modal caso não tenha uma task válida
      }

      // Abre o modal
      document.getElementById("editModal").style.display = "block";
  });
});

// Função para mover a task ao clicar nos botões dentro do modal
document.querySelectorAll(".edit-task-button").forEach(button => {
  button.addEventListener("click", function () {
      const taskElement = this.closest(".task"); // Pega o elemento da task clicada

      if (!taskElement) {
          console.warn("Nenhuma task encontrada para edição!");
          return;
      }

      const taskId = taskElement.getAttribute("data-task-id");
      if (!taskId) {
          console.warn("A task não possui um ID válido!");
          return;
      }

      // Armazena o ID da task no modal (para ser usado ao mover)
      document.getElementById("editModal").setAttribute("data-task-id", taskId);

      console.log("Task selecionada para edição, ID:", taskId);

      // Abre o modal
      document.getElementById("editModal").style.display = "block";
  });
});

// Função para mover a task ao clicar nos botões dentro do modal
document.querySelectorAll(".move-to-column").forEach(button => {
  button.addEventListener("click", function () {
      const targetColumnId = this.getAttribute("data-target-column");
      const targetColumn = document.getElementById(targetColumnId);
      const modal = document.getElementById("editModal");
      const taskId = modal.getAttribute("data-task-id");

      console.log("Botão clicado:", this.innerText);

      if (!taskId) {
          console.warn("Nenhuma task foi selecionada!");
          return;
      }

      // Encontra a task correspondente ao ID
      const selectedTask = document.querySelector(`.task[data-task-id="${taskId}"]`);

      if (!selectedTask) {
          console.warn("A task correspondente ao ID não foi encontrada no DOM!");
          return;
      }

      if (targetColumn) {
          targetColumn.appendChild(selectedTask);
          console.log(`Task ${taskId} movida para:`, targetColumnId);

          // Atualiza o status no banco de dados
          atualizarStatusNoBanco(taskId, targetColumnId);
      } else {
          console.warn("Coluna de destino não encontrada!");
      }

      // Fecha o modal
      fecharModal();
  });
});

// Fecha o modal e reseta a task editada
function fecharModal() {
  document.getElementById("editModal").style.display = "none";
  document.getElementById("editModal").removeAttribute("data-task-id");
}

// Atualiza o status no banco de dados via fetch (PUT)
async function atualizarStatusNoBanco(taskId, novoStatus) {
  try {
      const response = await fetch(`/api/checklists/${taskId}`, {
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ status: novoStatus }),
      });

      if (response.ok) {
          console.log("Status atualizado no banco:", novoStatus);
      } else {
          console.error("Erro ao atualizar status no banco!");
      }
  } catch (error) {
      console.error("Erro na requisição:", error);
  }
}




fetchTasks();
