"use strict";

const sqlite3 = require("sqlite3").verbose();

// open database in memory
module.exports = new sqlite3.Database(
  "./src/db/notes_db.db",
  sqlite3.OPEN_READWRITE,
  err => {
    if (err) {
      return console.error(err);
    }
    console.log("Connected");
  }
);
