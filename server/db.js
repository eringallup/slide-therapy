const config = require('../config');
const mongo = require('mongodb').MongoClient;
const _ = require('lodash');
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

class MongoDB extends Database {
  constructor(database, onConnect) {
    super(database, onConnect);
  }

  setup() {
    return this.db.listCollections().toArray().then(collections => {
      let counters = _.find(collections, {
        name: 'counters'
      });
      if (counters) {
        return Promise.resolve();
      }
      return this.db.collection('counters').insertOne({
        type: 'oid',
        count: 0
      }).then(() => {
        return this.db.collection('counters').createIndex('type', {
          type: 1
        }, {
          unique: true,
          background: true
        }).then(() => {
          return this.db.createCollection('orders').then(() => {
            return this.db.collection('orders').createIndex('oid', {
              oid: 1
            }, {
              unique: true,
              background: true
            });
          });
        });
      });
    });
  }

  drop() {
    if (this.database === config.database.name) {
      return Promise.reject(new Error('cannot drop production database.'));
    }
    return this.db.dropDatabase();
  }

  connect() {
    return mongo.connect('mongodb://localhost:27017/' + this.database).then(db => {
      this.db = db;
    });
  }

  close() {
    return this.db.close();
  }
}

module.exports = MongoDB;