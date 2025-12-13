const db = require('../config/db-adapter');

const createTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS eventos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      date DATE NOT NULL,
      description TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;
  db.run(query);
};

if (process.env.INIT_DB === 'true') {
  createTable();
}

const getAll = (callback) => {
  db.all(`SELECT * FROM eventos ORDER BY date ASC`, [], callback);
};

const add = (data, callback) => {
  const { title, date, description } = data;
  const query = `INSERT INTO eventos (title, date, description) VALUES (?, ?, ?)`;
  db.run(query, [title, date, description], callback);
};

const update = (id, data, callback) => {
  const { title, date, description } = data;
  const query = `UPDATE eventos SET title = ?, date = ?, description = ? WHERE id = ?`;
  db.run(query, [title, date, description, id], callback);
};

const remove = (id, callback) => {
  db.run(`DELETE FROM eventos WHERE id = ?`, [id], callback);
};

module.exports = { getAll, add, update, delete: remove };
