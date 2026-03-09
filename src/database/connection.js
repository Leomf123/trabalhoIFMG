const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '..', '..', 'database', 'database.db');

let db;

function connect(){
    if(db) return db;

    db = new sqlite3.Database(dbPath);

    db.run(`
        CREATE TABLE IF NOT EXISTS tabelaExemplo(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    `);

    return db;
}

function run(sql, params = []){
    const database = connect();
    return new Promise((resolve, reject) => {
        database.run(sql, params, function(err){
            if(err) return reject(err);
            resolve({ id: this.lastID, changes: this.changes});
        });
    });
}

function get(sql, params = []){
    const database = connect();
    return new Promise((resolve, reject) => {
        database.get(sql, params, (err, row) => {
            if(err) return reject(err);
            resolve(row);
        });
    });
}

function all(sql, params = []){
    const database = connect();
    return new Promise((resolve, reject) => {
        database.get(sql, params, (err, rows) => {
            if(err) return reject(err);
            resolve(rows);
        });
    });
}

module.exports = {connect, run, get, all};