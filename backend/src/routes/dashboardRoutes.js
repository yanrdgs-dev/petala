const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authenticateUser = require("../utils/authenticateUser");

// Autenticar usuário em todas as rotas
router.use(authenticateUser);
// GET /api/dashboard - Obter dados do dashboard
router.get("/", (req, res) => {
  const userId = req.user.id; // Obter id do usuário autenticado
  const query = "SELECT * FROM dashboard WHERE user_id = ?";

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Erro ao buscar o dashboard: ", err);
      return res.status(500).json({ message: "Erro ao buscar o dashboard." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Dados não encontrados." });
    }

    res.status(200).json(results[0]);
  });
});

// PUT /api/dashboard -- Atualizar dados do dashboard
router.put("/", (req, res) => {
  const userId = req.user.id;
  const {
    tarefas_em_progresso,
    tarefas_completas_semana,
    tempo_foco_semana
  } = req.body;

  const query =
    "UPDATE dashboard SET tarefas_em_progresso = ?, tarefas_completas_semana = ?, tempo_foco_semana = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?";

  db.query(
    query,
    [
      tarefas_em_progresso,
      tarefas_completas_semana,
      tempo_foco_semana,
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

router.put("/zerar_semanal_automatico", (req, res) => {
    const userId = req.user.id;
    const querySelect = "SELECT updated_at FROM dashboard WHERE user_id = ?";

    db.query(querySelect, [userId], (err, results) => {
        if (err) {
            console.error("Erro ao verificar o dashboard: ", err);
            return res.status(500).json({ message: "Erro ao verificar o dashboard" });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Dashboard não encontrado" });
        }

        const lastUpdated = new Date(results[0].updated_at);
        const now = new Date();
        const diffTime = Math.abs(now - lastUpdated);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays >= 7) {
            const queryUpdate = "UPDATE dashboard SET tarefas_completas_semana = 0, tempo_foco_semana = 0 WHERE user_id = ?";

            db.query(queryUpdate, [userId], (err, results) => {
                if (err) {
                    console.error("Erro ao zerar o dashboard: ", err);
                    return res.status(500).json({ message: "Erro ao zerar o dashboard" });
                }
                if (results.affectedRows === 0) {
                    return res.status(404).json({ message: "Dashboard não encontrado" });
                }

                res.status(200).json({ message: "Dashboard zerado com sucesso" });
            });
        } else {
            res.status(200).json({ message: "Ainda não se passaram 7 dias desde a última atualização" });
        }
    });
});

module.exports = router;
