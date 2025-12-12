const db = require('../config/db');

// Cria a tabela de usuários se não existir
const createUserTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            password TEXT,
            role TEXT,
            fullName TEXT
        )
    `;
    db.run(query);
};

// Chama a criação da tabela ao carregar o model
createUserTable();

const createUser = (user, callback) => {
    const { email, password, role, fullName } = user;
    const query = `INSERT INTO users (email, password, role, fullName) VALUES (?, ?, ?, ?)`;
    db.run(query, [email, password, role, fullName], callback);
};

const findUserByEmail = (email, callback) => {
    const query = `SELECT * FROM users WHERE email = ?`;
    db.get(query, [email], callback);
};

module.exports = {
    createUser,
    findUserByEmail
};
