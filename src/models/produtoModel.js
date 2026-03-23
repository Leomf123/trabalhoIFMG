const connect = require('../../database/db');

class ProdutoModel {

  static async findById(id) {
    const db = await connect();
    return db.get('SELECT * FROM produtos WHERE id = ?', [id]);
  }

  static async update(id, dados) {
    const db = await connect();

    return db.run(
      `UPDATE produtos 
       SET nome = ?, descricao = ?, preco = ?
       WHERE id = ?`,
      [dados.nome, dados.descricao, dados.preco, id]
    );
  }
}

module.exports = ProdutoModel;