const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../../database.sqlite');

const db = new Database(dbPath);

db.prepare(`
  CREATE TABLE IF NOT EXISTS transacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    descricao TEXT NOT NULL,
    valor REAL NOT NULL,
    tipo TEXT NOT NULL CHECK(tipo IN ('receita', 'despesa')),
    categoria TEXT NOT NULL,
    data TEXT NOT NULL
  )
`).run();

console.log('Banco de dados Better-SQLite3 conectado e tabela criada!');

module.exports = db;