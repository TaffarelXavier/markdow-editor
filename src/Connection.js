var db = require("sqlite-sync"); //requiring
const {
  path_db
} = require("./components/framework.js");

module.exports = class Connection {

  static conn() {
    db.connect(path_db());
    return db;
  }

}