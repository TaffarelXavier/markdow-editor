var Connection = require("../Connection.js");


class Tag {
   
  static conn() {
    return Connection.conn();
  }
  /**
   *
   */
  static tableName() {
    return "tags";
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
      var conn = Tag.conn();
      var res = conn.run(`SELECT * FROM ${Tag.tableName()} ORDER BY tag_name ASC;`);
      if (res.error) return console.error(res.error);
      conn.close();
      return res;
    } catch (error) {
      console.error(error);
    }
  }
  }
  
  module.exports = {
    Tag
  };
  