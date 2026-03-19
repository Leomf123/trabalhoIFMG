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
            console.log('Entrou no try');
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
        console.log(product);

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

    static async buscarPorProdutos(){
        return await db.get(
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