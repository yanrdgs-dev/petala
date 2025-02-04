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
  
    // Limpa os containers antes de renderizar as tasks
    Object.values(taskContainers).forEach(
      (container) => (container.innerHTML = "")
    );
  
    tasks.forEach((task) => {
      // Cria o elemento <li> e define seu atributo data-id
      const taskElement = document.createElement("li");
      taskElement.setAttribute("data-id", task.id);
  
      // Cria a div para o texto
      const divText = document.createElement("div");
      divText.classList.add("text");
      divText.textContent = task.titulo;
  
      // Cria a div para os botões (ícones)
      const divButtons = document.createElement("div");
      divButtons.classList.add("buttons");
  
      // Botão de edição
      const editButton = document.createElement("button");
      editButton.innerHTML = "<i class='fa-solid fa-pen'></i>";
      editButton.onclick = () => openEditModal(task.id, task.titulo);
  
      // Botão de remoção
      const deleteButton = document.createElement("button");
      deleteButton.innerHTML = "<i class='fa-solid fa-trash'></i>";
      deleteButton.onclick = () => deleteTask(task.id);
      deleteButton.classList.add("delete");
  
      // Adiciona os botões na div de botões
      divButtons.appendChild(editButton);
      divButtons.appendChild(deleteButton);
  
      // Adiciona as duas divs dentro do <li>
      taskElement.appendChild(divText);
      taskElement.appendChild(divButtons);
  
      // Adiciona o <li> no container correspondente ao status da task
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
  modalInput.value = currentTitle;
  modal.style.display = "flex";

  
  const saveButton = document.getElementById("saveEdit");
  saveButton.onclick = () => {
    const updatedData = { titulo: modalInput.value.trim() };
    saveEdit(taskId, updatedData);
    modal.style.display = "none";
    modal.removeAttribute("data-task-id");
  };
}


document.getElementById("cancelEdit").onclick = () => {
  document.getElementById("editModal").style.display = "none";
};

document.querySelectorAll(".edit-task-button").forEach(button => {
  button.addEventListener("click", function () {
    
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
    
      document.querySelectorAll(".task-being-edited").forEach(task => {
          task.classList.remove("task-being-edited");
      });

  
      const taskElement = this.closest(".task");

      if (taskElement) {
          taskElement.classList.add("task-being-edited");
          console.log("Task selecionada para edição:", taskElement);
      } else {
          console.warn("Nenhuma task foi selecionada!");
          return; 
      }

  
      document.getElementById("editModal").style.display = "block";
  });
});


document.querySelectorAll(".edit-task-button").forEach(button => {
  button.addEventListener("click", function () {
      const taskElement = this.closest(".task"); 

      if (!taskElement) {
          console.warn("Nenhuma task encontrada para edição!");
          return;
      }

      const taskId = taskElement.getAttribute("data-task-id");
      if (!taskId) {
          console.warn("A task não possui um ID válido!");
          return;
      }

      
      document.getElementById("editModal").setAttribute("data-task-id", taskId);

      console.log("Task selecionada para edição, ID:", taskId);

    
      document.getElementById("editModal").style.display = "block";
  });
});


const columnStatusMap = {
  "lista-em-andamento": "pendente",
  "lista-revisar": "revisar",
  "lista-Concluido": "concluida",
};


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

    if (!response.ok) throw new Error("Erro ao atualizar o status da tarefa.");

    fetchTasks(); 
  } catch (error) {
    console.error(error);
    alert("Erro ao atualizar o status da tarefa.");
  }
}

document.querySelectorAll(".move-to-column").forEach((button) => {
  button.addEventListener("click", function () {
    
    const targetColumn = button.getAttribute("data-target-column");
    const newStatus = columnStatusMap[targetColumn];
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

  
    modal.style.display = "none";
    modal.removeAttribute("data-task-id");
  });
});



function fecharModal() {
  document.getElementById("editModal").style.display = "none";
  document.getElementById("editModal").removeAttribute("data-task-id");
}




fetchTasks();
