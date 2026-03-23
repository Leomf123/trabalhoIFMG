const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function connect() {
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });

  // cria tabela se não existir
  await db.exec(`
    CREATE TABLE IF NOT EXISTS produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      descricao TEXT,
      preco REAL
    )
  `);

  // INSERE UM PRODUTO DE TESTE (somente se tabela estiver vazia)
  const produto = await db.get('SELECT * FROM produtos LIMIT 1');

  if (!produto) {
    await db.run(`
      INSERT INTO produtos (nome, descricao, preco)
      VALUES ('Brownie Teste', 'Teste inicial', 10.00)
    `);

    console.log('Produto de teste inserido');
  }

  return db;
}

module.exports = connect;