const API_URL = "http://localhost:3000/api/checklists";
const token = localStorage.getItem("token");


// Função para buscar tarefas e renderizar na tela
async function fetchTasks() {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar tarefas.");
    }

    const tasks = await response.json();
    renderTasks(tasks);
  } catch (error) {
    console.error(error);
    alert("Erro ao buscar tarefas.");
  }
}


// Função para criar uma nova tarefa
async function addTask(listId, inputId) {
  const inputElement = document.getElementById(inputId);
  const taskTitle = inputElement.value.trim();

  if (!taskTitle) {
    alert("O título da tarefa é obrigatório.");
    return;
  }

  const newTask = { titulo: taskTitle };

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

// Função para excluir uma tarefa
async function deleteTask(taskId) {
  try {
    const response = await fetch(`${API_URL}/${taskId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao excluir a tarefa.");
    }

    fetchTasks(); // Atualiza a lista após excluir
    alert("Tarefa excluída com sucesso!");
  } catch (error) {
    console.error("Erro ao excluir tarefa:", error);
    alert(error.message);
  }
}

// Função para salvar a edição de uma tarefa
async function saveEdit(taskId, updatedData) {
  try {
    const response = await fetch(`${API_URL}/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        
      },
      body: JSON.stringify(updatedData),
      titulo: updatedTitle,
      colunaId: newColumnId,
    });

    if (!response.ok) {
      throw new Error("Erro ao atualizar tarefa.");
    }

    fetchTasks();
  } catch (error) {
    console.error(error);
    alert("Erro ao atualizar tarefa.");
  }
}

async function moveTask(taskId, newColumnId) {
  try {
      const response = await fetch(`${API_URL}/${taskId}`, {
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ colunaId: newColumnId }), // Atualiza a coluna da tarefa
      });

      if (!response.ok) {
          throw new Error("Erro ao mover tarefa.");
      }

      fetchTasks(); // Atualiza a lista de tarefas
  } catch (error) {
      console.error("Erro ao mover a tarefa:", error);
      alert("Não foi possível mover a tarefa.");
  }
}

// Função para renderizar tarefas na tela
function renderTasks(tasks) {
  const taskContainers = {
    "lista-em-andamento": document.getElementById("lista-em-andamento"),
    "lista-revisar": document.getElementById("lista-revisar"),
    "lista-Concluido": document.getElementById("lista-Concluido"),
  };

  Object.values(taskContainers).forEach(
    (container) => (container.innerHTML = "")
  );

  tasks.forEach((task) => {
    const taskElement = document.createElement("li");
    taskElement.textContent = task.titulo;

    // Botão de editar (ícone)
    const editButton = document.createElement("button");
    editButton.innerHTML = '<i class="fa-solid fa-pen"></i>';
    editButton.onclick = () => openEditModal(task.id, task.titulo);

    // Botão de deletar (ícone)
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    deleteButton.onclick = () => deleteTask(task.id);

    // Adiciona botões ao elemento da tarefa
    taskElement.appendChild(editButton);
    taskElement.appendChild(deleteButton);

    // Adiciona a tarefa à lista correspondente
    taskContainers["lista-em-andamento"].appendChild(taskElement);
  });
}

// Abre o modal de edição
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

// Fecha o modal de edição
document.getElementById("cancelEdit").onick = () => {
  document.getElementById("editModal").style.display = "none";


};

// Abre o modal para edição
function openModal(taskElement) {
  const modal = document.querySelector("#editModal");
  const taskText = taskElement.textContent;
  modal.querySelector("#modalInput").value = taskText;
  modal.setAttribute("data-task-id", taskElement.getAttribute("data-id"));
  modal.style.display = "flex";
}

// Fecha o modal
function closeModal() {
  document.querySelector("#editModal").style.display = "none";
}

// Evento para cancelar edição
document.querySelector("#cancelEdit").addEventListener("click", closeModal);

// Salva a edição do texto da tarefa
document.querySelector("#saveEdit").addEventListener("click", function () {
  const modal = document.querySelector("#editModal");
  const taskId = modal.getAttribute("data-task-id");
  const newText = modal.querySelector("#modalInput").value;
  
  const taskElement = document.querySelector(`[data-id='${taskId}']`);
  if (taskElement) {
      taskElement.textContent = newText;
  }

  closeModal();
});

// Move a tarefa para a coluna selecionada
document.querySelectorAll(".move-to-column").forEach((button) => {
  button.addEventListener("click", function () {
      const modal = document.querySelector("#editModal");
      const taskId = modal.getAttribute("data-task-id");
      const targetColumnId = this.getAttribute("data-target-column");

      const taskElement = document.querySelector(`[data-id='${taskId}']`);
      const targetColumn = document.querySelector(`#${targetColumnId}`);

      if (taskElement && targetColumn) {
          targetColumn.appendChild(taskElement);
          closeModal();
      }
  });
});

// Função para adicionar tarefas
function addTask(columnId, inputId) {
  const input = document.getElementById(inputId);
  const taskText = input.value.trim();
  if (!taskText) return;

  const taskId = `task-${Date.now()}`;
  const taskElement = document.createElement("li");
  taskElement.classList.add("task");
  taskElement.setAttribute("data-id", taskId);
  taskElement.textContent = taskText;

  taskElement.addEventListener("click", function () {
      openModal(this);
  });

  document.getElementById(columnId).appendChild(taskElement);
  input.value = "";
}




// Inicializa a página buscando as tarefas
fetchTasks();

