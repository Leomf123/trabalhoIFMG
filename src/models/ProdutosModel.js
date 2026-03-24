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
            // ALTERAÇÃO Christian: Adicionado usuario_id no INSERT
            const result = await db.run(
                `INSERT INTO products (
                name,
                description,
                price,
                usuario_id) VALUES (?, ?, ?, ?)`,
                [
                    this.body.name,
                    this.body.description,
                    this.body.price,
                    this.body.usuario_id
                ]
            )
           
            return {id: result.id};

        } catch(e){
            console.error('Erro ao registrar produto:', e);
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

    // ALTERAÇÃO Christian: Método para buscar produtos de um usuário específico (Central da Loja)
    static async buscarPorUsuario(usuarioId){
        return await db.all(
            `SELECT * FROM products WHERE usuario_id = ? ORDER BY id DESC`, 
            [usuarioId]
        );
    }

    // ALTERAÇÃO Christian: Método para buscar TODOS os produtos com dados da loja (Vitrine Pública)
    static async buscarTodosProdutos(){
        return await db.all(`
            SELECT p.*, u.nome, u.nomeLoja, u.descricaoLoja 
            FROM products p
            INNER JOIN usuarios u ON p.usuario_id = u.id
            ORDER BY p.id DESC
        `);
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

    // ALTERAÇÃO Christian: Método para verificar se produto pertence ao usuário (segurança na deleção)
    static async verificarPropriedade(produtoId, usuarioId){
        const produto = await db.get(
            `SELECT * FROM products WHERE id = ? AND usuario_id = ?`,
            [produtoId, usuarioId]
        );
        return produto !== undefined;
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
        // Validar se preço é um número válido
        if(this.body.price && isNaN(parseFloat(this.body.price))){
            this.errors.push('Preço deve ser um número válido!');
        }
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
            price: this.body.price || '',
            usuario_id: this.body.usuario_id || null
        };
        
    }

}

module.exports = Produtos;