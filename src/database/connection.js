require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

//const dbPath = path.resolve(__dirname, '..', '..', 'database', 'database.db');
const dbPath = process.env.DB_PATH;

let db;

function connect(){
    if(db) return db;

    db = new sqlite3.Database(dbPath);

    db.run(`
        CREATE TABLE IF NOT EXISTS usuarios(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            nomeLoja TEXT NOT NULL,
            descricaoLoja TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS products(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            description TEXT NOT NULL,
            price TEXT NOT NULL
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