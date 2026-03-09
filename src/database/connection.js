const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '..', '..', 'database', 'bancoDados.db');

let db;

function connect(){
    if(db) return db;

    db = new sqlite3.Database(dbPath);

    db.run(`
        CREATE TABLE IF NOT EXISTS tabelaExemplo(
            id INTECER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    `);

    return db;
}