function addItem(listId, inputId) {
    const list = document.getElementById(listId);
    const input = document.getElementById(inputId);

    if (input.value.trim() === "") {
        alert("O campo de texto não pode estar vazio!");
        return;
    }

    const li = document.createElement("li");

    // Div para o texto (esquerda)
    const divText = document.createElement("div");
    divText.classList.add("text");
    divText.textContent = input.value;

    // Div para os botões (direita)
    const divButtons = document.createElement("div");
    divButtons.classList.add("buttons");

    // Botão de edição
    const editButton = document.createElement("button");
    editButton.innerHTML = '<i class="fa-solid fa-pen"></i>';
    editButton.onclick = () => {
        const newText = prompt("Edite o texto:", divText.textContent);
        if (newText !== null) {
            divText.textContent = newText.trim();
        }
    };

    // Botão de remoção
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    deleteButton.classList.add("delete");
    deleteButton.onclick = () => li.remove();

    //----

    divButtons.appendChild(editButton);
    divButtons.appendChild(deleteButton);

    li.appendChild(divText);
    li.appendChild(divButtons);

    list.appendChild(li);

    input.value = "";
}
