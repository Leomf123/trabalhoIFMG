const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '..', '..', 'database', 'bancoDados.db');

let db;

function connect(){
    if(db) return db;

    db = new sqlite3.Database(dbPath);

    return db;
}