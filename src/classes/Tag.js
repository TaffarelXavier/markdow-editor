class Tag {
    static conn(){
        return Connection.conn();
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
  }
  module.exports = {
    Tag
  };
  