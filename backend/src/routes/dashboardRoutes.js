const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authenticator = require("../middlewares/authenticator");

// GET /api/dashboard - Obter dados do dashboard
router.get("/", authenticator, (req, res) => {
  const userId = req.user.id; // Obter id do usuário autenticado
  const query = "SELECT * FROM dashboard WHERE user_id = ?";

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Erro ao buscar o dashboard: ", err);
      return res.status(500).json({ message: "Erro ao buscar o dashboard" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Dashboard não encontrado" });
    }

    res.status(200).json(results[0]);
  });
});

// PUT /api/dashboard -- Atualizar dados do dashboard
router.put("/", authenticator, (req, res) => {
  const userId = req.user.id;
  const {
    tarefas_em_progresso,
    tarefas_completas_semana,
    tempo_foco_semana,
    provas_futuras,
  } = req.body;

  const query =
    "UPDATE dashboard SET tarefas_em_progresso = ?, tarefas_completas_semana = ?, tempo_foco_semana = ?, provas_futuras = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?";

  db.query(
    query,
    [
      tarefas_em_progresso,
      tarefas_completas_semana,
      tempo_foco_semana,
      provas_futuras,
      userId,
    ],
    (err, results) => {
      if (err) {
        console.error("Erro ao atualizar o dashboard: ", err);
        return res
          .status(500)
          .json({ message: "Erro ao atualizar o dashboard" });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Dashboard não encontrado" });
      }

      res.status(200).json({ message: "Dashboard atualizado com sucesso" });
    },
  );
});

module.exports = router;
