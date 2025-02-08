const express = require("express");
const router = express.Router();
const db = require("../config/db"); 
const authenticateUser = require("../utils/authenticateUser");

// Autenticar usuário em todas as rotas
router.use(authenticateUser);

// Criar tarefa
router.post("/", (req, res) => {
  const userId = req.user.id;
  const { data, titulo, descricao, horario } = req.body;

  if (!titulo) {
    return res.status(400).json({ message: "O título é obrigatório." });
  }

  const query = `INSERT INTO agenda (user_id, data, titulo, descricao, horario) VALUES (?, ?, ?, ?, ?)`;

  db.query(query, [userId, data, titulo, descricao, horario || null], (err) => {
    if (err) {
      console.error("Erro ao adicionar evento: ", err);
      return res.status(500).json({ message: "Erro ao adicionar evento." });
    }

    res.status(201).json({ message: "Evento adicionado com sucesso." });
  });
});


// Buscar tarefas
router.get("/", (req, res) => {
  const userId = req.user.id;
  const query = `SELECT data, id, titulo, descricao, horario 
                 FROM agenda 
                 WHERE user_id = ? 
                 ORDER BY data`;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Erro ao buscar eventos: ", err);
      return res.status(500).json({ message: "Erro ao buscar eventos." });
    }

    res.status(200).json(results);
  });
});

router.put("/:id", (req, res) => {
  const userId = req.user.id;
  const agendaID = req.params.id;
  const { titulo, descricao, horario } = req.body;

  if (!titulo && !descricao && !horario) {
    return res.status(400).json({
      message: "É necessário fornecer ao menos um campo para atualizar.",
    });
  }

  const query = `UPDATE agenda SET titulo = COALESCE(?, titulo), descricao = COALESCE(?, descricao), horario = COALESCE(?, horario) WHERE user_id = ? AND id = ?`;

  db.query(query, [titulo, descricao, horario, userId, agendaID], (err, result) => {
    if (err) {
      console.error("Erro ao atualizar evento: ", err);
      return res.status(500).json({ message: "Erro ao atualizar evento: ", err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Evento não encontrado." });
    }

    res.status(200).json({ message: "Evento atualizado com sucesso." });
  });
});


router.delete("/:id", (req, res) => {
  const userId = req.user.id;
  const agendaID = req.params.id;

  const query = `DELETE FROM agenda WHERE user_id = ? AND id = ?`;

  db.query(query, [userId, agendaID], (err, result) => {
    if (err) {
      console.error("Erro ao excluir evento: ", err);
      return res.status(500).json({ message: "Erro ao excluir evento." });
    }

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Evento não encontrado" });
    }

    return res.status(200).json({ message: "Evento excluído com sucesso." });
  });
});
module.exports = router;

