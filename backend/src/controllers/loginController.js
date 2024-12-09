const db = require('../config/db.js');
const bcrypt = require('bcryptjs');


exports.login = (req,res) => {
    
    const {name, password}  = req.body;
    

    if (!name || !password) {
        return res.status(400).json({ message: "Nome e senha são obrigatórios." });
    }

    
    db.query("SELECT * FROM  users WHERE name = ?", [name], (err,result) => {
        
        if (err) {
            return res.status(500).send({message:"Erro no servidor"})
            
        }
        if (result.length == 0) {

            return res.status(400).send({message:"Nome ou senha incorretos"})

        }
        
        const usuario = result[0]
        

        bcrypt.compare(password, usuario.password_hash, (err, isMatch) =>{

            if(err){
                return res.status(500).json({ message: "Erro ao verificar sua senha." });

            }
            if (!isMatch) {
                return res.status(400).json({ message: "Nome ou senha incorretos." });
              }
              
              
              res.status(200).json({message:"Sucesso ao entrar", user: {
                id: usuario.id, 
                name: usuario.name
            }
    
            })  
        })
        
    }
    )
}