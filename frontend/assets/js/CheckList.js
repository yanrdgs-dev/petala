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
        const modal = document.getElementById("editModal");
        const modalInput = document.getElementById("modalInput");
        const saveButton = document.getElementById("saveEdit");
        const cancelButton = document.getElementById("cancelEdit");
        const moveToColumnButtons = document.querySelectorAll(".move-to-column");

        // Preenche o campo de input com o texto atual
        modalInput.value = divText.textContent.trim();

        // Define os botões de mover dinamicamente
        moveToColumnButtons.forEach((button) => {
            const targetColumn = button.dataset.targetColumn;

            // Oculta botões que não fazem sentido para a coluna atual
            if (targetColumn === li.dataset.currentColumn) {
                button.style.display = "none";
            } else {
                button.style.display = "block";
                button.onclick = () => {
                    // Remove o item da coluna atual
                    li.remove();

                    // Atualiza o dataset para a nova coluna
                    li.dataset.currentColumn = targetColumn;

                    // Adiciona o item na coluna de destino
                    const targetList = document.getElementById(targetColumn);
                    targetList.appendChild(li);

                    // Esconde o modal
                    modal.style.display = "none";
                };
            }
        });

        // Exibe o modal
        modal.style.display = "flex";

        // Salva a edição
        saveButton.onclick = () => {
            const newText = modalInput.value.trim();
            if (newText) {
                divText.textContent = newText;
            }
            modal.style.display = "none"; // Esconde o modal
        };

        // Cancela a edição
        cancelButton.onclick = () => {
            modal.style.display = "none"; // Apenas esconde o modal
        };

        // Fecha o modal ao clicar fora dele
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.style.display = "none";
            }
        };
    };

    // Botão de remoção
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    deleteButton.classList.add("delete");
    deleteButton.onclick = () => li.remove();

    divButtons.appendChild(editButton);
    divButtons.appendChild(deleteButton);

    li.appendChild(divText);
    li.appendChild(divButtons);

    // Define o dataset da coluna atual
    li.dataset.currentColumn = listId;

    list.appendChild(li);

    input.value = "";
}
