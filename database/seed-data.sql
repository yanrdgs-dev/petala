-- Inserção de casos teste na tabela de usuários
INSERT INTO users (name, email, password_hash)
VALUES
("Usuário1", "usuario1@gmail.com", "exemplo_senha_123"),
("Usuário2","usuario2@gmail.com","exemplo_senha_456"),
("Usuário3","usuario3@gmail.com","exemplo_senha_789");

-- Teste de outras tabelas (TODO)

-- Mensagem de sucesso
SELECT "Dados de exemplo inseridos com sucesso.";