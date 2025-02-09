const API_URL = "http://localhost:3000/api/checklists";
const token = localStorage.getItem("token");

// Mapeia o ID do container para o status esperado pelo backend
const statusMap = {
  "lista-em-andamento": "pendente",
  "lista-revisar": "revisar",
  "lista-Concluido": "concluida",
};

// Se necessário, usamos o mesmo mapa para converter o ID da coluna para o status
const columnStatusMap = {
  "lista-em-andamento": "pendente",
  "lista-revisar": "revisar",
  "lista-Concluido": "concluida",
};

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
  const newTask = {
    titulo: taskTitle,
    status: statusMap[listId] || "pendente",
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
    inputElement.value = "";
    fetchTasks();
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

  // Limpa os containers antes de renderizar as tasks
  Object.values(taskContainers).forEach((container) => {
    container.innerHTML = "";
  });

  tasks.forEach((task) => {
    const taskElement = document.createElement("li");
    taskElement.classList.add("task");
    taskElement.setAttribute("data-task-id", task.id);

    // Div para o texto
    const divText = document.createElement("div");
    divText.classList.add("text");
    divText.textContent = task.titulo;

    const divButtons = document.createElement("div");
    divButtons.classList.add("buttons");

    const editButton = document.createElement("button");
    editButton.innerHTML = "<i class='fa-solid fa-pen'></i>";
    editButton.onclick = () => openEditModal(task.id, task.titulo);

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "<i class='fa-solid fa-trash'></i>";
    deleteButton.onclick = () => deleteTask(task.id);
    deleteButton.classList.add("delete");

    divButtons.appendChild(editButton);
    divButtons.appendChild(deleteButton);

    taskElement.appendChild(divText);
    taskElement.appendChild(divButtons);

    // Coloca a task no container correspondente ao seu status
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
 
  modal.setAttribute("data-task-id", taskId);
  // modal.setAttribute("data-task-id", taskId);
  modalInput.value = currentTitle;
  modal.style.display = "flex";

  
  const saveButton = document.getElementById("saveEdit");
  saveButton.onclick = () => {
    const updatedData = { titulo: modalInput.value.trim() };
    saveEdit(taskId, updatedData);
    fecharModal();
  };
}

function fecharModal() {
  const modal = document.getElementById("editModal");
  modal.style.display = "none";
  modal.removeAttribute("data-task-id");
}


document.getElementById("cancelEdit").onclick = () => {
  fecharModal();
};

document.querySelectorAll(".move-to-column").forEach((button) => {
  button.addEventListener("click", function () {
    const targetColumnId = this.getAttribute("data-target-column");

    const newStatus = columnStatusMap[targetColumnId];
    if (!newStatus) {
      alert("Status inválido!");
      return;
    }

    const modal = document.getElementById("editModal");
    const taskId = modal.getAttribute("data-task-id");
    if (!taskId) {
      alert("Tarefa não definida.");
      return;
    }

    updateTaskStatus(taskId, newStatus);
    fecharModal();
  });
});

async function updateTaskStatus(taskId, newStatus) {
  try {
    const response = await fetch(`${API_URL}/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });
    if (response.ok) {
      console.log("Status atualizado no banco:", newStatus);
      fetchTasks();
    } else {
      console.error("Erro ao atualizar status no banco!");
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
  }
}

fetchTasks();
