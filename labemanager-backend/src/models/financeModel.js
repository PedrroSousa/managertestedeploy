const db = require('../config/db');

// Creates the table if it doesn't exist
const createTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS transacoes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tipo TEXT NOT NULL, -- 'RECEITA', 'DESPESA', 'INVESTIMENTO'
            valor REAL NOT NULL,
            descricao TEXT NOT NULL,
            data DATE NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;
    db.run(query, (err) => {
        if (err) console.error('[DB] Erro ao criar tabela de transações:', err.message);
        else console.log('[DB] Tabela de transações pronta.');
    });
};

createTable();

const getAll = (callback) => {
    db.all(`SELECT * FROM transacoes ORDER BY data DESC, id DESC`, [], callback);
};

const add = (data, callback) => {
    const { tipo, valor, descricao, data: dataTransacao } = data;
    const query = `INSERT INTO transacoes (tipo, valor, descricao, data) VALUES (?, ?, ?, ?)`;
    db.run(query, [tipo, valor, descricao, dataTransacao], function (err) {
        callback(err, { id: this.lastID, ...data });
    });
};

const update = (id, data, callback) => {
    const { tipo, valor, descricao, data: dataTransacao } = data;
    const query = `UPDATE transacoes SET tipo = ?, valor = ?, descricao = ?, data = ? WHERE id = ?`;
    db.run(query, [tipo, valor, descricao, dataTransacao, id], function (err) {
        callback(err, { id, ...data });
    });
};

const remove = (id, callback) => {
    db.run(`DELETE FROM transacoes WHERE id = ?`, [id], callback);
};

module.exports = {
    getAll,
    add,
    update,
    delete: remove
};
