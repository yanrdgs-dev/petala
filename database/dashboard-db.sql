-- Seleciona o banco de dados
USE petala;

-- Cria tabela de informações do dashboard
CREATE TABLE dashboard (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    tarefas_em_progresso INT DEFAULT 0,
    tarefas_completas_semana INT DEFAULT 0,
    tempo_foco_semana INT DEFAULT 0, -- armazenado em minutos
    provas_futuras INT DEFAULT 0,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- Mensagem de sucesso
SELECT "Tabela de informações do dashboard criada com sucesso.";
