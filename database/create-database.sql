-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS petala;

-- Selecionar o banco de dados
USE petala;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY, -- id único sequencial
    username VARCHAR(50) UNIQUE NOT NULL, -- username do usuário
    name VARCHAR(100) NOT NULL, -- nome do usuário
    email VARCHAR(100) UNIQUE NOT NULL, -- email único
    password_hash VARCHAR(255) NOT NULL, -- senha criptografada
    email_verification_token VARCHAR(255) NOT NULL,
    email_verify BOOLEAN DEFAULT false,
    email_expires TIMESTAMP 
);

-- Logs de acesso (TODO)

-- Mensagem de sucesso
SELECT "Banco de dados e tabelas criados com sucesso.";
