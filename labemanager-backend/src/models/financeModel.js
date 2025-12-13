const db = require('../config/db-adapter');

const createTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS transacoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo TEXT NOT NULL,
      valor REAL NOT NULL,
      descricao TEXT NOT NULL,
      data DATE NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;
  db.run(query);
};

if (process.env.INIT_DB === 'true') {
  createTable();
}

const getAll = (callback) => {
  db.all(`SELECT * FROM transacoes ORDER BY data DESC, id DESC`, [], callback);
};

const add = (data, callback) => {
  const { tipo, valor, descricao, data: dataTransacao } = data;
  const query = `INSERT INTO transacoes (tipo, valor, descricao, data) VALUES (?, ?, ?, ?)`;
  db.run(query, [tipo, valor, descricao, dataTransacao], callback);
};

const update = (id, data, callback) => {
  const { tipo, valor, descricao, data: dataTransacao } = data;
  const query = `UPDATE transacoes SET tipo = ?, valor = ?, descricao = ?, data = ? WHERE id = ?`;
  db.run(query, [tipo, valor, descricao, dataTransacao, id], callback);
};

const remove = (id, callback) => {
  db.run(`DELETE FROM transacoes WHERE id = ?`, [id], callback);
};

module.exports = { getAll, add, update, delete: remove };
