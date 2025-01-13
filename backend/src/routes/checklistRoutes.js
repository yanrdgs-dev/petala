const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authenticateUser = require("../utils/authenticateUser");

// Autenticar usuário em todas as rotas
router.use(authenticateUser);

router.post("/", (req, res) => {
  const userId = req.user.id;
  const { titulo, descricao, prazo } = req.body;

  if (!titulo) {
    return res.status(400).json({ message: "O título é obrigatório." });
  }

  const query = `INSERT INTO checklist (user_id, titulo, descricao, prazo) VALUES (?, ?, ?, ?)`;

  db.query(query, [userId, titulo, descricao, prazo || null], (err) => {
    if (err) {
      console.error("Erro ao adicionar tarefa: ", err);
      return res.status(500).json({ message: "Erro ao adicionar tarefa." });
    }

    res.status(201).json({ message: "Tarefa adicionada com sucesso." });
  });
});

router.get("/", (req, res) => {
  const userId = req.user.id;
  const query = `SELECT id, titulo, descricao, status, prazo, created_at, updated_at FROM checklist WHERE user_id = ? ORDER BY created_at DESC`;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Erro ao buscar tarefas: ", err);
      return res.status(500).json({ message: "Erro ao buscar tarefas." });
    }

    res.status(200).json(results);
  });
});

module.exports = router;
