-- Inserção de casos teste na tabela de usuários
INSERT INTO users (username, name, email, password_hash)
VALUES
("usuario1", "Usuário1", "usuario1@gmail.com", "exemplo_senha_123"),
("usuario2", "Usuário2","usuario2@gmail.com","exemplo_senha_456"),
("usuario3", "Usuário3","usuario3@gmail.com","exemplo_senha_789");

-- Teste de outras tabelas (TODO)

-- Mensagem de sucesso
SELECT "Dados de exemplo inseridos com sucesso.";
