var Connection = require("../Connection.js");

class Note {
  static conn() {
    return Connection.conn();
  }
  /**
   *
   */
  static tableName() {
    return "notes";
  }

  /**
   *
   * @param {*} note
   */
  static create(note) {
    try {
      var conn = Note.conn();

      var {
        note_title,
        note_description,
        note_code,
        note_category_id,
        note_type_language
      } = note;

      var note = {
        note_title: note_title,
        note_description: note_description,
        note_code: note_code,
        note_category_id: note_category_id,
        note_type_language: note_type_language,
        created_at: Date.now()
      };

      var res = conn.insert(Note.tableName(), note);

      if (res.error) return console.error(res.error);

      conn.close();

      note.note_id = res != undefined || res != null ? res : -1;

      return note;
    } catch (error) {
      console.error(error);
    }
  }

  /**
   *
   * @param {*} note
   */
  static update(note) {
    var conn = Note.conn();

    var {
      note_id,
      note_title,
      note_description,
      note_code,
      note_category_id,
      note_type_language
    } = note;

    var note_upd = {
      note_title: note_title,
      note_description: note_description,
      note_code: note_code,
      note_category_id: note_category_id,
      note_type_language: note_type_language
    };

    conn.update(Note.tableName(), note_upd, { note_id: note_id });

    var res = conn.run(
      `SELECT note_id, note_title, note_description, note_code
    note_category_id, note_type_language FROM ${Note.tableName()} WHERE note_id = ?`,
      [note_id]
    );

    if (res.error) return res.error;

    conn.close();

    return res[0];
  }

  /**
   *
   * @param {*} note_id
   */
  static delete(note_id) {
    try {
      var conn = Note.conn();
      var res = conn.run(`DELETE FROM ${Note.tableName()} WHERE note_id = ?;`, [
        parseInt(note_id)
      ]);
      if (res.error) return console.error(res.error);
      conn.close();
      return res;
    } catch (error) {
      console.error(error);
    }
  }
  /**
   *
   */
  static findById(note_id) {
    try {
      var conn = Note.conn();
      var res = conn.run(
        `SELECT * FROM ${Note.tableName()} WHERE note_id = ?`,
        [note_id]
      );
      if (res.error) return console.error(res.error);
      conn.close();
      return res;
    } catch (error) {
      console.error(error);
    }
  }

  static all() {
    try {
      var conn = Note.conn();
      var res = conn.run(`SELECT * FROM ${Note.tableName()}`);
      if (res.error) return console.error(res.error);
      conn.close();
      return res;
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = {
  Note
};
