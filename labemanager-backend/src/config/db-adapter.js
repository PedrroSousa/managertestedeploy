const db = require('./db');

module.exports = {
  run(sql, params = [], cb) {
    db.execute({ sql, args: params })
      .then(res => cb && cb(null, res))
      .catch(err => cb && cb(err));
  },

  all(sql, params = [], cb) {
    db.execute({ sql, args: params })
      .then(res => cb && cb(null, res.rows))
      .catch(err => cb && cb(err));
  },

  get(sql, params = [], cb) {
    db.execute({ sql, args: params })
      .then(res => cb && cb(null, res.rows[0]))
      .catch(err => cb && cb(err));
  },

  serialize(fn) {
    fn();
  }
};
