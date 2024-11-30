const db = require('../config/db.js');
const bcrypt = require('bcryptjs');


exports.login = (req,res) => {
    
    const {name, password}  = req.body;

    bcrypt.query("SELECT * FROM  users WHERE name" [name], (err,result) => {
        
        if (err) {
            res.status(400).send("Erro no servidor")
            
        }
        if (result.length == 0) {

            res.status(400).send("Nome ou senha incorretos")

        }
        
        const usuario = result[0]
        

        bcrypt.compare(password, user_password_hash, (hash, isMatch) =>{

            if(err){
                return res.status(500).json({ message: "Erro ao verificar sua senha." });

            }
            if (!isMatch) {
                return res.status(400).json({ message: "E-mail ou senha incorretos." });
              }
              
              
        })
    }
    )
}