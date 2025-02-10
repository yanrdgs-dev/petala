const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authenticateUser = require("../utils/authenticateUser");

router.use(authenticateUser);
router.get("/", (req, res) => {
  const userId = req.user.id;
  
  const query = `
    SELECT 
      (SELECT COUNT(*) FROM checklist WHERE user_id = ? AND status = 'pendente') AS tarefas_pendentes,
      (SELECT COUNT(*) FROM checklist 
         WHERE user_id = ? AND status = 'concluida'
           AND data_conclusao >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      ) AS tarefas_concluidas,
      tarefas_em_progresso, 
      tarefas_completas_semana, 
      (SELECT SEC_TO_TIME(SUM(actualStudyDuration)) 
       FROM focus_sessions 
       WHERE user_id = ? AND timestamp >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      ) AS tempo_foco_semana
    FROM dashboard 
    WHERE user_id = ?
  `;
  
  // Note que precisamos passar o userId 4 vezes
  db.query(query, [userId, userId, userId, userId], (err, results) => {
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

router.put("/", (req, res) => {
  const userId = req.user.id;
  const { tarefas_em_progresso, tarefas_completas_semana, tempo_foco_semana } = req.body;

  const query = `
    UPDATE dashboard 
    SET tarefas_em_progresso = ?, 
        tarefas_completas_semana = ?, 
        tempo_foco_semana = ?, 
        updated_at = CURRENT_TIMESTAMP 
    WHERE user_id = ?
  `;

  db.query(query, [tarefas_em_progresso, tarefas_completas_semana, tempo_foco_semana, userId], (err, results) => {
    if (err) {
      console.error("Erro ao atualizar o dashboard: ", err);
      return res.status(500).json({ message: "Erro ao atualizar o dashboard" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Dashboard não encontrado" });
    }
    res.status(200).json({ message: "Dashboard atualizado com sucesso" });
  });
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
      const queryUpdate = "UPDATE dashboard SET tarefas_completas_semana = 0, tempo_foco_semana = '00:00:00' WHERE user_id = ?";
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