const db = require('../database/connection');


class Usuario{
    constructor(body){
        this.body = body;
        this.errors = [];
    }

    async register(){
        const result = await db.run(
            `INSERT INTO usuarios (
            nome,
            sobrenome,
            email,
            telefone) VALUES (?,?,?,?)`,
            [
                this.body.nome,
                this.body.sobrenome,
                this.body.email,
                this.body.telefone
            ]
        )
        return {id: result.id};

    }
}

module.exports = Usuario;