var db = require("sqlite-sync"); //requiring

module.exports = class Connection {

  static conn() {
    db.connect("C:/Users/Taffarel/AppData/Local/codenotetx/notes_db.db");
    return db;
  }
}