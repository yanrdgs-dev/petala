
const API_URL = "http://localhost:3000/api/checklists";
const token = localStorage.getItem('token');


if (!token) {
  alert('Você precisa estar logado!');
  window.location.href = './login.html';
}

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};



async function fetchTasks() {
  try {
    const response = await fetch(API_URL, { headers });
    const tasks = await response.json();

    
    tasks.forEach((task) => addTaskToUI(task));
  } catch (error) {
    console.error("Erro ao buscar tarefas:", error);
  }
}


async function addTask(listId, inputId) {
  const titulo = document.getElementById(inputId).value;

  if (!titulo) {
    alert("Digite um título para a tarefa!");
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({ titulo }),
    });

    if (response.ok) {
      const task = await response.json();
      addTaskToUI(task);
      document.getElementById(inputId).value = ""; 
    } else {
      alert("Erro ao adicionar tarefa!");
    }
  } catch (error) {
    console.error("Erro ao adicionar tarefa:", error);
  }
}


function addTaskToUI(task) {
  const list = document.getElementById("lista-em-andamento"); 

  const li = document.createElement("li");
  li.setAttribute("data-id", task.id);
  li.innerHTML = `
  <span>${task.titulo}</span>
  <button onclick="deleteTask(${task.id || 'null'})"><i class="fa-solid fa-trash"></i></button>
`;


  list.appendChild(li);
}


async function updateTask(id, newTitle) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ titulo: newTitle }),
    });

    if (response.ok) {
      alert("Tarefa atualizada com sucesso!");
    } else {
      alert("Erro ao atualizar tarefa!");
    }
  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error);
  }
}


async function deleteTask(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers,
    });

    if (response.ok) {
      document.querySelector(`[data-id="${id}"]`).remove();
    } else {
      alert("Erro ao excluir tarefa!");
    }
  } catch (error) {
    console.error("Erro ao excluir tarefa:", error);
  }
}


document.addEventListener("DOMContentLoaded", fetchTasks);
