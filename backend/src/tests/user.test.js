const request = require("supertest");
const app = require("../app"); // Referência ao app do Express
const db = require("../config/db");

afterEach(async () => {
  db.query('DELETE FROM users WHERE username = "newuser"');
});
afterAll(async () => {
  db.query('DELETE FROM users WHERE email = "existing@example.com"');
  await db.end();
});
describe("POST /api/users/register", () => {
  it("deve registrar um usuário com sucesso", async () => {
    const response = await request(app).post("/api/users/register").send({
      username: "newuser",
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Usuário cadastrado com sucesso.");
  });

  it("não deve registrar usuário com email já existente", async () => {
    // Primeiro registra um usuário
    await request(app).post("/api/users/register").send({
      username: "existinguser",
      name: "Existing User",
      email: "existing@example.com",
      password: "password123",
    });

    // Tenta registrar com o mesmo email
    const response = await request(app).post("/api/users/register").send({
      username: "newuser",
      name: "New User",
      email: "existing@example.com",
      password: "password123",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("E-mail já cadastrado.");
  });
  it("não deve registrar usuário com username já existente", async () => {
    await request(app).post("/api/users/register").send({
      username: "newuser",
      name: "Existing User",
      email: "test@example.com",
      password: "password123",
    });
    const response = await request(app).post("/api/users/register").send({
      username: "newuser",
      name: "New User",
      email: "newuser@example.com",
      password: "password123",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Nome de usuário já existe.");
  });
  it("não deve registrar usuário sem um email", async () => {
    const response = await request(app).post("/api/users/register").send({
      username: "newuser",
      name: "New User",
      password: "password123",
    });
    const emailError = response.body.errors.find(
      (error) => error.path === "email",
    );
    expect(response.status).toBe(400);
    expect(emailError.msg).toBe("Forneça um e-mail válido.");
  });
  it("verificar se a senha é muito pequena", async () => {
    const response = await request(app).post("/api/users/register").send({
      username: "newuser",
      name: "New User",
      email: "test@example.com",
      password: "short",
    });
    const passwordError = response.body.errors.find(
      (error) => error.path === "password",
    );
    expect(response.status).toBe(400);
    expect(passwordError.msg).toBe("A senha deve ter pelo menos 8 caracteres.");
  });
  it("verificar se a senha possui números", async () => {
    const response = await request(app).post("/api/users/register").send({
      username: "newuser",
      name: "New User",
      email: "test@example.com",
      password: "password",
    });
    const passwordError = response.body.errors.find(
      (error) => error.path === "password",
    );
    expect(response.status).toBe(400);
    expect(passwordError.msg).toBe("A senha deve conter pelo menos um número.");
  });
  it("verificar se a senha possui letras", async () => {
    const response = await request(app).post("/api/users/register").send({
      username: "newuser",
      name: "New User",
      email: "test@example.com",
      password: "12345678",
    });
    const passwordError = response.body.errors.find(
      (error) => error.path === "password",
    );
    expect(response.status).toBe(400);
    expect(passwordError.msg).toBe("A senha deve conter pelo menos uma letra.");
  });
});
