-- Acessa o banco de dados
USE petala;

-- Script para criar a tabela de agenda
CREATE TABLE agenda (
    id INT AUTO_INCREMENT PRIMARY KEY,              -- Identificador único da tarefa
    user_id INT NOT NULL,                           -- Relacionamento com o usuário
    titulo VARCHAR(255) NOT NULL,                   -- Título da tarefa
    descricao TEXT,                                 -- Descrição da tarefa
    horario TIME,                                   -- Horário da tarefa
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE -- Relacionamento com a tabela de usuários
);

-- Criado com sucesso
SELECT "Tabela Agenda criada com sucesso.";


