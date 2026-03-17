const validator  = require('validator');
const bcrypt = require('bcryptjs');
const db = require('../database/connection');

class Usuario{
    constructor(body){
        this.body = body;
        this.errors = [];
        this.user = null;
    }

    async register(){
        this.valida();
        if(this.errors.length > 0) return;

        await this.userExists();
        if(this.errors.length > 0) return;

        try{
            const salt = await bcrypt.genSalt(12);
            const hash = await bcrypt.hash(this.body.password, salt);
            /*
                    nome,
                    sobrenome,
                    nome da empresa,
                    categoria,
                    breve descrição da empresa,
                    chave pix?,
                    email,
                    telefone,
                    senha

            */
            const result = await db.run(
                `INSERT INTO usuarios (email, password)
                VALUES (?,?)`,
                [
                    this.body.email,
                    hash
                ]
            )
            console.log(result);
            this.user = {
                id: result.id,
                emai: this.body.email,
            }

        } catch(e){
            if(e.message.includes('UNIQUE')){
                this.errors.push('Usuário já existe');
                return;
            }
            throw e;
        }
    }

    async login(){
        this.valida();
        if(this.errors.length > 0) return;

        const user = await db.get(`
            SELECT id, email, password FROM usuarios
            WHERE email = ?`,
            [this.body.email]
        );

        if(!user){
            this.errors.push('Usuário não cadastrado. Cadastre-se!');
        }

        // Transforma as senhas em hash para nnão serem armazanadas
        //como texto puro na base de dados
        const senhaValida = await bcrypt.compare(
            this.body.password, user.password
        );

        if(!senhaValida){
            this.errors.push('Senha inválida!');
            return;
        }
        this.user = {
            id: user.id,
            email: user.email
        }
    }

    async userExists(){
        const user = await db.get(
        `SELECT id, email, password FROM 
        usuarios WHERE email = ?`,
        [this.body.email]
        );
        if(user) this.errors.push('Usuário já existe');
    }

    valida(){
        this.cleanUp();

        if(!this.body.email || !validator.isEmail(this.body.email)){
            this.errors.push('E-mail inválido');
        }
        if(!this.body.password){
            this.errors.push('Senha obrigatória');
        }
        if(this.body.password && (this.body.password.length < 6 || this.body.password.length > 50 )){
            this.errors.push('A senha deve ter entre 6 e 50 caracteres!');
        }
    }

    cleanUp(){
        for(let key in this.body){
            if(typeof this.body[key] !== 'string'){
                this.body[key] = '';
            }
        };

        this.body = {
            email: this.body.email || '',
            password: this.body.password || ''
        };

    }
}

module.exports = Usuario;