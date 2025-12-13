const db = require('../config/db-adapter');

const createTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS pessoas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL,
      dataAdesao DATE,
      tipo TEXT NOT NULL,
      areas TEXT,
      fotoUrl TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;
  db.run(query);
};

if (process.env.INIT_DB === 'true') {
  createTable();
}

const getAll = (callback) => {
  db.all(`SELECT * FROM pessoas ORDER BY nome ASC`, [], callback);
};

const add = (data, callback) => {
  const { nome, email, dataAdesao, tipo, areas, fotoUrl } = data;
  const query = `INSERT INTO pessoas (nome, email, dataAdesao, tipo, areas, fotoUrl) VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(query, [nome, email, dataAdesao, tipo, areas, fotoUrl], callback);
};

const update = (id, data, callback) => {
  const { nome, email, dataAdesao, tipo, areas, fotoUrl } = data;
  const query = `UPDATE pessoas SET nome=?, email=?, dataAdesao=?, tipo=?, areas=?, fotoUrl=? WHERE id=?`;
  db.run(query, [nome, email, dataAdesao, tipo, areas, fotoUrl, id], callback);
};

const remove = (id, callback) => {
  db.run(`DELETE FROM pessoas WHERE id = ?`, [id], callback);
};

module.exports = { getAll, add, update, delete: remove };
