const sigint = require('slidetherapy/sigint');

class Database {
  constructor(database, onConnect) {
    if (!database) {
      throw new Error('no database');
    }
    this.database = database;
    this.connect().then(() => {
      return this.setup().then(() => {
        onConnect();
      });
    }).catch(onConnect);

    sigint.addTask(next => {
      if (!this.db) {
        return next();
      }
      this.db.close().then(() => {
        console.info('Closed database connection');
        next();
      });
    });
  }
}

module.exports.Database = Database;
