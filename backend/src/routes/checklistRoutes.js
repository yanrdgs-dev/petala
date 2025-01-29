const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authenticateUser = require("../utils/authenticateUser");


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
  const query = `SELECT id, titulo, descricao, status, prazo, created_at, updated_at 
                 FROM checklist 
                 WHERE user_id = ? 
                 ORDER BY created_at DESC`;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Erro ao buscar tarefas: ", err);
      return res.status(500).json({ message: "Erro ao buscar tarefas." });
    }

    res.status(200).json(results);
  });
});

router.put("/:id", (req, res) => {
  const userId = req.user.id; 
  const checklistID = req.params.id; 
  
  const { titulo, descricao, prazo } = req.body;

  if (!checklistID) {
    return res.status(400).json({ message: "O ID da tarefa é obrigatório." });
  }

  if (!titulo && !descricao && !prazo) {
    return res.status(400).json({
      message: "É necessário fornecer ao menos um campo para atualizar.",
    });
  }

  const query = `
    UPDATE checklist 
    SET 
      titulo = COALESCE(?, titulo), 
      descricao = COALESCE(?, descricao), 
      prazo = COALESCE(?, prazo), 
      updated_at = NOW() 
    WHERE user_id = ? AND id = ?
  `;

  db.query(
    query,
    [titulo, descricao, prazo, userId, checklistID],
    (err, result) => {
      if (err) {
        console.error("Erro ao atualizar tarefa: ", err);
        return res.status(500).json({ message: "Erro ao atualizar tarefa." });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Tarefa não encontrada." });
      }

      res.status(200).json({ message: "Tarefa atualizada com sucesso." });
    }
  );
});

router.delete("/:id", (req, res) => {
  const userId = req.user.id;
  const checklistID = req.params.id;

  const query = `DELETE FROM checklist WHERE user_id = ? AND id = ?`;

  db.query(query, [userId, checklistID], (err, result) => {
    if (err) {
      console.error("Erro ao excluir tarefa: ", err);
      return res.status(500).json({ message: "Erro ao excluir tarefa." });
    }

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Tarefa não encontrada" });
    }

    return res.status(200).json({ message: "Tarefa excluída com sucesso.", id: checklistID });

  });
});
module.exports = router;
