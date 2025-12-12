const db = require('../config/db');

// Creates the table if it doesn't exist
const createTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS pessoas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT NOT NULL,
            dataAdesao DATE,
            tipo TEXT NOT NULL, -- 'ALUNO' or 'PROFESSOR'
            areas TEXT,
            fotoUrl TEXT, -- Base64 string or URL
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;
    db.run(query, (err) => {
        if (err) console.error('[DB] Erro ao criar tabela de pessoas:', err.message);
        else console.log('[DB] Tabela de pessoas pronta.');
    });
};

createTable();

const getAll = (callback) => {
    // Sort by name for convenience
    db.all(`SELECT * FROM pessoas ORDER BY nome ASC`, [], callback);
};

const add = (data, callback) => {
    const { nome, email, dataAdesao, tipo, areas, fotoUrl } = data;
    const query = `INSERT INTO pessoas (nome, email, dataAdesao, tipo, areas, fotoUrl) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(query, [nome, email, dataAdesao, tipo, areas, fotoUrl], function (err) {
        callback(err, { id: this.lastID, ...data });
    });
};

const update = (id, data, callback) => {
    const { nome, email, dataAdesao, tipo, areas, fotoUrl } = data;
    const query = `UPDATE pessoas SET nome = ?, email = ?, dataAdesao = ?, tipo = ?, areas = ?, fotoUrl = ? WHERE id = ?`;
    db.run(query, [nome, email, dataAdesao, tipo, areas, fotoUrl, id], function (err) {
        callback(err, { id, ...data });
    });
};

const remove = (id, callback) => {
    db.run(`DELETE FROM pessoas WHERE id = ?`, [id], callback);
};

module.exports = {
    getAll,
    add,
    update,
    delete: remove
};
