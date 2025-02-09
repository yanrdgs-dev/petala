
const express = require('express');
const router = express.Router();
const connection = require('../config/db'); 
const authenticateUser = require('../utils/authenticateUser');

router.use(authenticateUser);


router.get('/', (req, res) => {
  const userId = req.user.id;
  connection.query(
    'SELECT * FROM focus_sessions WHERE user_id = ? ORDER BY timestamp DESC',
    [userId],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao buscar sessões de foco.' });
      }
      res.json(rows);
    }
  );
});


router.post('/', (req, res) => {
  const { studyTime, breakTime, actualStudyDuration } = req.body;
  if (
    typeof studyTime !== 'number' ||
    typeof breakTime !== 'number' ||
    typeof actualStudyDuration !== 'number'
  ) {
    return res.status(400).json({ error: 'Dados insuficientes ou inválidos.' });
  }

  const userId = req.user.id;
  connection.query(
    'INSERT INTO focus_sessions (user_id, studyTime, breakTime, actualStudyDuration) VALUES (?, ?, ?, ?)',
    [userId, studyTime, breakTime, actualStudyDuration],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao registrar sessão de foco.' });
      }
      const newSession = {
        id: result.insertId,
        user_id: userId,
        studyTime,
        breakTime,
        actualStudyDuration,
        timestamp: new Date(), 
      };
      res.status(201).json(newSession);
    }
  );
});


router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { studyTime, breakTime, actualStudyDuration } = req.body;
  const userId = req.user.id;

  
  connection.query(
    'SELECT * FROM focus_sessions WHERE id = ? AND user_id = ?',
    [id, userId],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao buscar sessão de foco.' });
      }
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Sessão não encontrada.' });
      }

      
      connection.query(
        'UPDATE focus_sessions SET studyTime = ?, breakTime = ?, actualStudyDuration = ? WHERE id = ?',
        [studyTime, breakTime, actualStudyDuration, id],
        (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao atualizar sessão de foco.' });
          }
          res.json({ id, studyTime, breakTime, actualStudyDuration });
        }
      );
    }
  );
});

router.delete("/:id", authenticateUser, (req, res) => {
    const sessionId = req.params.id;
    const userId = req.user.id;
  
    const query = "DELETE FROM focus_sessions WHERE id = ? AND user_id = ?";
    
    connection.query(query, [sessionId, userId], (err, results) => {
      if (err) {
        console.error("Erro ao deletar a sessão:", err);
        return res.status(500).json({ message: "Erro ao deletar a sessão." });
      }
  
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Sessão não encontrada ou não pertence ao usuário." });
      }
  
      res.status(200).json({ message: "Sessão deletada com sucesso." });
    });
  });
module.exports = router;
