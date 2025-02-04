-- Acessa o banco de dados
USE petala;

-- Script para criar a tabela Checklist
CREATE TABLE checklist (
    id INT AUTO_INCREMENT PRIMARY KEY,              -- Identificador único da tarefa
    user_id INT NOT NULL,                           -- Relacionamento com o usuário
    titulo VARCHAR(255) NOT NULL,                   -- Título da tarefa
    descricao TEXT,                                 -- Descrição da tarefa
    status ENUM('pendente', 'concluida') DEFAULT 'pendente', -- Status da tarefa
    prazo DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Data de criação
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Data de atualização
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE -- Relacionamento com a tabela de usuários
);

-- Criado com sucesso
SELECT "Tabela Checklist criada com sucesso.";


