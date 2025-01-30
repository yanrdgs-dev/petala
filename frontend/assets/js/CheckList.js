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
    "lista-Concluido": "concluida"
  };

  const newTask = {
    titulo: taskTitle,
    status: statusMap[listId] || "pendente" // Define o status correto com base na coluna
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

  Object.values(taskContainers).forEach((container) => (container.innerHTML = ""));

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

document.querySelectorAll(".move-to-column").forEach((button) => {
  button.addEventListener("click", async function () {
    const modal = document.querySelector("#editModal");
    const taskId = modal.getAttribute("data-task-id");
    const targetStatus = this.getAttribute("data-target-status");

    if (taskId && targetStatus) {
      await saveEdit(taskId, { status: targetStatus });
      modal.style.display = "none";
      fetchTasks(); // Atualiza a lista após a mudança de status
    }
  });
});


fetchTasks();
