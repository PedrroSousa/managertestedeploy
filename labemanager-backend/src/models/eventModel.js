const db = require('../config/db');

// Creates the table if it doesn't exist
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
    db.run(query, (err) => {
        if (err) console.error('[DB] Erro ao criar tabela de eventos:', err.message);
        else console.log('[DB] Tabela de eventos pronta.');
    });
};

createTable();

const getAll = (callback) => {
    db.all(`SELECT * FROM eventos ORDER BY date ASC`, [], callback);
};

const add = (data, callback) => {
    const { title, date, description } = data;
    const query = `INSERT INTO eventos (title, date, description) VALUES (?, ?, ?)`;
    db.run(query, [title, date, description], function (err) {
        callback(err, { id: this.lastID, ...data });
    });
};

const update = (id, data, callback) => {
    const { title, date, description } = data;
    const query = `UPDATE eventos SET title = ?, date = ?, description = ? WHERE id = ?`;
    db.run(query, [title, date, description, id], function (err) {
        callback(err, { id, ...data });
    });
};

const remove = (id, callback) => {
    db.run(`DELETE FROM eventos WHERE id = ?`, [id], callback);
};

module.exports = {
    getAll,
    add,
    update,
    delete: remove
};
