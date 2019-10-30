var Connection = require("../Connection.js");

class Language {

  static conn() {
    return Connection.conn();
  }
  /**
   *
   */
  static tableName() {
    return "languages";
  }
  static create() {
    return "create";
  }
  static delete() {
    return "delete";
  }
  static findById() {
    return "findById";
  }
  static update() {
    return "update";
  }
  static all() {
    try {
      var conn = Language.conn();
      var res = conn.run(`SELECT * FROM ${Language.tableName()} ORDER BY lang_name;`);
      if (res.error) return console.error(res.error);
      conn.close();
      return res;
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = {
  Language,
};
