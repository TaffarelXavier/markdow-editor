var Connection = require("../Connection.js");

class Category{

  static conn() {
    return Connection.conn();
  }
  /**
   *
   */
  static tableName() {
    return "category";
  }

 /**
  * 
  * @param {*} category_name 
  */
  static create(category_name) {
    try {
      var conn = Category.conn();
      var res = conn.insert(Category.tableName(), {
        category_name: category_name.toUpperCase()
      });
      if (res.error) return console.error(res.error);
      conn.close();
      return { last_id: res, category_name: category_name.toUpperCase() };
    } catch (error) {
      console.error(error);
    }
  }

  /**
   *
   * @param {*} category_id
   */
  static delete(category_id) {
    
    try {
      var conn = Category.conn();
      var res = conn.run(
        `DELETE FROM ${Category.tableName()} WHERE category_name = ? OR category_id = ?`,
        [category_id.toUpperCase(), category_id]
      );
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
  static findById(categoryFilter) {
    try {
      var conn = Category.conn();
      var res = conn.run(`SELECT * FROM ${Category.tableName()} WHERE category_name LIKE ? OR category_id = ?`,
      [categoryFilter.toUpperCase(), categoryFilter]);
      if (res.error) return console.error(res.error);
      conn.close();
      return res;
    } catch (error) {
      console.error(error);
    }
  }
  /**
   *
   * @param {*} category_name
   * @param {*} category_id
   */
  static update(category_name, category_id) {
    var conn = Category.conn();
    conn.update(
      Category.tableName(),
      { category_name: category_name.toUpperCase() },
      { category_id: category_id },
      function(res) {
        if (res.error) throw res.error;
        conn.close();
      }
    );
  }

  static all() {
    try {
      var conn = Category.conn();
      var res = conn.run(`SELECT * FROM ${Category.tableName()}`);
      if (res.error) return console.error(res.error);
      conn.close();
      return res;
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = {
  Category
};
