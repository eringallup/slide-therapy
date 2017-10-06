const sigint = require('slidetherapy/sigint');

class Database {
  constructor(database, onConnect) {
    if (!database) {
      throw new Error('no database');
    }
    this.database = database;
    this.connect().then(() => {
      return this.setup().then(() => {
        onConnect(this.db);
      });
    }).catch(onConnect);

    sigint.addTask(next => {
      this.close().then(() => {
        console.info('Closed database connection');
        next();
      });
    });
  }
}

module.exports.Database = Database;