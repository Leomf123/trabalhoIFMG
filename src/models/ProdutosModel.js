const db = require('../database/connection');

class Produtos{
    constructor(body){
        this.body = body;
        this.errors = []; //armazenar erros que possa acontecer
    }

    async register(){
        this.valida();
        if(this.errors.length > 0) return;

        await this.productExists(this.body.name);
        if(this.errors.length > 0) return;

        try{
            const result = await db.run(
                `INSERT INTO products (
                name,
                description,
                price) VALUES (?, ?, ?)`,
                [
                    this.body.name,
                    this.body.description,
                    this.body.price
                ]
            )
           
            return {id: result.id};

        } catch(e){

        }
    }

    async edit(id){
        if(!id) return;

        this.valida();
        if(this.errors.length > 0) return;

        await this.productExists(this.body.name, id);
        if(this.errors.length > 0) return;

        await db.run(
            `UPDATE products SET name = ?, 
            description = ?,
            price = ? WHERE id = ?
            `, [
                this.body.name,
                this.body.description,
                this.body.price,
                id
            ]
        );
        return await Produtos.buscarPorId(id);
    }

    async productExists(name, id = null){
    
        if(!name) return;

        const product = await db.get(`
            SELECT * FROM products WHERE name = ?`,
        [name]
        );

        const convertId = id ? Number(id): null;

        if(product && product.id !== convertId){
            this.errors.push('Há no banco um produto com este nome cadastrado.');
        }
    }

    static async buscarPorId(id){
        return await db.get(
            `SELECT * FROM products WHERE id = ?`, [id]
        );
    }

    static async buscarProdutos(){
        return await db.all(
            `SELECT * FROM products ORDER BY id DESC`
        );
    }

    static async delete(id){
        return await db.run(
            `DELETE FROM products WHERE id = ?`, [id]
        );
    }

    valida(){
        this.cleanUp();
        if(!this.body.name){
            this.errors.push('Nome é obrigatório!');
        }
        if(!this.body.description){
            this.errors.push('Descrição é obrigatória!');
        }
        if(!this.body.price){
            this.errors.push('Preço é obrigatório!');
        }
        //To do: Validar se preço é um número válido

        /*
        To do: Validações antonio
        if (!name || !validator.isLength(name.trim(), { min: 2, max: 100 })) {
            return res.render("create", {
              error: "Nome do produto deve ter entre 2 e 100 caracteres.",
            });
          }

           if (!price || !validator.isFloat(String(price), { min: 0 })) {
              return res.render("create", {
                error: "Preço deve ser um número positivo.",
              });
            }

            name: validator.escape(name.trim()),
    price: parseFloat(price).toFixed(2),

    // validação simples
        if (!nome || !preco) {
            req.flash('error', 'Nome e preço são obrigatórios');
            return res.redirect(`/produtos/editar/${produtoId}`);
        }
        */
    }

    cleanUp(){
        for(let key in this.body){
            if(typeof this.body[key] !== 'string'){
                this.body[key] = '';
            }
        };

        this.body = {
            name: this.body.name || '',
            description: this.body.description || '',
            price: this.body.price || ''
        };
        
    }

}

module.exports = Produtos;