const db = require('../config/db-adapter');

const ALLOWED_TABLES = ['almoxarifado', 'maquinas', 'departamentos', 'projetos', 'artigos'];

const createTable = (tableName) => {
  if (!ALLOWED_TABLES.includes(tableName)) return;

  const query = `
    CREATE TABLE IF NOT EXISTS ${tableName} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      marca TEXT,
      descricao TEXT,
      imageUrl TEXT,
      lideres TEXT,
      pdfUrl TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;
  db.run(query);
};

if (process.env.INIT_DB === 'true') {
  ALLOWED_TABLES.forEach(createTable);
}

const getAll = (tableName, callback) => {
  if (!ALLOWED_TABLES.includes(tableName)) return callback(new Error('Tabela inválida'));
  db.all(`SELECT * FROM ${tableName} ORDER BY id DESC`, [], callback);
};

const add = (tableName, data, callback) => {
  if (!ALLOWED_TABLES.includes(tableName)) return callback(new Error('Tabela inválida'));
  const { nome, marca, descricao, imageUrl, lideres, pdfUrl } = data;
  const query = `INSERT INTO ${tableName} (nome, marca, descricao, imageUrl, lideres, pdfUrl) VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(query, [nome, marca, descricao, imageUrl, lideres, pdfUrl], callback);
};

const update = (tableName, id, data, callback) => {
  if (!ALLOWED_TABLES.includes(tableName)) return callback(new Error('Tabela inválida'));
  const { nome, marca, descricao, imageUrl, lideres, pdfUrl } = data;
  const query = `UPDATE ${tableName} SET nome=?, marca=?, descricao=?, imageUrl=?, lideres=?, pdfUrl=? WHERE id=?`;
  db.run(query, [nome, marca, descricao, imageUrl, lideres, pdfUrl, id], callback);
};

const remove = (tableName, id, callback) => {
  if (!ALLOWED_TABLES.includes(tableName)) return callback(new Error('Tabela inválida'));
  db.run(`DELETE FROM ${tableName} WHERE id = ?`, [id], callback);
};

module.exports = { getAll, add, update, delete: remove };
