-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS petala;

-- Selecionar o banco de dados
USE petala;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY, -- id único sequencial
    name VARCHAR(100) NOT NULL, -- nome
    email VARCHAR(100) UNIQUE NOT NULL, -- email único
    password_hash VARCHAR(255) NOT NULL -- senha criptografada
);

-- Logs de acesso (TODO)

-- Mensagem de sucesso
SELECT "Banco de dados e tabelas criados com sucesso.";