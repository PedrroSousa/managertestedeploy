const db = require('../config/db');

// Map table names to valid identifiers to prevent SQL injection
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
    db.run(query, (err) => {
        if (err) {
            console.error(`Erro ao criar tabela ${tableName}:`, err.message);
        } else {
            // Migração simplificada: tenta adicionar colunas novas se elas não existirem
            // Isso evita erro se a tabela já existir mas sem essas colunas
            const alterQuery1 = `ALTER TABLE ${tableName} ADD COLUMN lideres TEXT`;
            const alterQuery2 = `ALTER TABLE ${tableName} ADD COLUMN pdfUrl TEXT`;

            db.run(alterQuery1, (err) => { /* Ignorar erro se coluna já existir */ });
            db.run(alterQuery2, (err) => { /* Ignorar erro se coluna já existir */ });
        }
    });
};

// Initialize tables
ALLOWED_TABLES.forEach(createTable);

// FORCE KEY COLUMN MIGRATION FOR DEPARTAMENTOS AND OTHERS
// This ensures 'lideres' and 'pdfUrl' exist even if createTable skipped them
const ensureColumns = () => {
    ['departamentos', 'projetos', 'artigos'].forEach(table => {
        db.serialize(() => {
            // Tenta adicionar a coluna 'lideres'
            db.run(`ALTER TABLE ${table} ADD COLUMN lideres TEXT`, (err) => {
                if (!err) console.log(`[DB] Coluna 'lideres' adicionada a ${table}.`);
                else if (err.message.includes('duplicate column')) { /* Ignore if exists */ }
                else console.error(`[DB] Erro ao adicionar 'lideres' em ${table}: ${err.message}`);
            });

            // Tenta adicionar a coluna 'pdfUrl'
            db.run(`ALTER TABLE ${table} ADD COLUMN pdfUrl TEXT`, (err) => {
                if (!err) console.log(`[DB] Coluna 'pdfUrl' adicionada a ${table}.`);
                else if (err.message.includes('duplicate column')) { /* Ignore if exists */ }
                else console.error(`[DB] Erro ao adicionar 'pdfUrl' em ${table}: ${err.message}`);
            });
        });
    });
};

// Run immediately (serialize handles headers)
ensureColumns();

const getAll = (tableName, callback) => {
    if (!ALLOWED_TABLES.includes(tableName)) return callback(new Error('Tabela inválida'));
    db.all(`SELECT * FROM ${tableName} ORDER BY id DESC`, [], callback);
};

const add = (tableName, data, callback) => {
    if (!ALLOWED_TABLES.includes(tableName)) return callback(new Error('Tabela inválida'));
    // Desestruturação segura, pegando os novos campos
    const { nome, marca, descricao, imageUrl, lideres, pdfUrl } = data;

    const query = `INSERT INTO ${tableName} (nome, marca, descricao, imageUrl, lideres, pdfUrl) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(query, [nome, marca, descricao, imageUrl, lideres, pdfUrl], function (err) {
        callback(err, { id: this.lastID, ...data });
    });
};

const update = (tableName, id, data, callback) => {
    if (!ALLOWED_TABLES.includes(tableName)) return callback(new Error('Tabela inválida'));
    const { nome, marca, descricao, imageUrl, lideres, pdfUrl } = data;
    const query = `UPDATE ${tableName} SET nome = ?, marca = ?, descricao = ?, imageUrl = ?, lideres = ?, pdfUrl = ? WHERE id = ?`;
    db.run(query, [nome, marca, descricao, imageUrl, lideres, pdfUrl, id], function (err) {
        callback(err, { id, ...data });
    });
};

const remove = (tableName, id, callback) => {
    if (!ALLOWED_TABLES.includes(tableName)) return callback(new Error('Tabela inválida'));
    db.run(`DELETE FROM ${tableName} WHERE id = ?`, [id], callback);
};

module.exports = {
    getAll,
    add,
    update,
    delete: remove
};
