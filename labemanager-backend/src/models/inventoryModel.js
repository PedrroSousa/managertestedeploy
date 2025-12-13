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
  if (!ALLOWED_TABLES.includes(tableName)) {
    return callback(new Error('Tabela inválida'));
  }

  const allowedFields = [
    'nome',
    'marca',
    'descricao',
    'quantidade',
    'imageUrl',
    'lideres',
    'pdfUrl'
  ];

  const fields = [];
  const values = [];
  const placeholders = [];

  allowedFields.forEach(field => {
    if (data[field] !== undefined) {
      fields.push(field);
      values.push(data[field]);
      placeholders.push('?');
    }
  });

  const query = `
    INSERT INTO ${tableName}
    (${fields.join(', ')})
    VALUES (${placeholders.join(', ')})
  `;

  db.run(query, values, function (err) {
    if (err) {
      console.error(`[DB][${tableName}] Erro ao inserir:`, err);
      return callback(err);
    }

    callback(null, { id: this.lastID, ...data });
  });
};


const update = (tableName, id, data, callback) => {
  if (!ALLOWED_TABLES.includes(tableName)) {
    return callback(new Error('Tabela inválida'));
  }

  const allowedFields = [
    'nome',
    'marca',
    'descricao',
    'quantidade',
    'imageUrl',
    'lideres',
    'pdfUrl'
  ];

  const sets = [];
  const values = [];

  allowedFields.forEach(field => {
    if (data[field] !== undefined) {
      sets.push(`${field} = ?`);
      values.push(data[field]);
    }
  });

  values.push(id);

  const query = `
    UPDATE ${tableName}
    SET ${sets.join(', ')}
    WHERE id = ?
  `;

  db.run(query, values, callback);
};


const remove = (tableName, id, callback) => {
  if (!ALLOWED_TABLES.includes(tableName)) return callback(new Error('Tabela inválida'));
  db.run(`DELETE FROM ${tableName} WHERE id = ?`, [id], callback);
};

module.exports = { getAll, add, update, delete: remove };
